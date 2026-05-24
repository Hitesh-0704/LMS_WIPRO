package com.lmsproject.api;

import com.lmsproject.dto.PaymentOrderRequest;
import com.lmsproject.dto.PaymentVerifyRequest;
import com.lmsproject.model.Enrollment;
import com.lmsproject.model.Student;
import com.lmsproject.repository.EnrollmentRepository;
import com.lmsproject.security.CustomUserDetails;
import com.lmsproject.service.CourseService;
import com.lmsproject.service.EmailService;
import com.lmsproject.service.StudentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HexFormat;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentApiController {

    private final StudentService       studentService;
    private final CourseService        courseService;
    private final EnrollmentRepository enrollmentRepository;
    private final EmailService         emailService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.course.price}")
    private int coursePrice;   // in paise (99900 = ₹999)

    // ─── Step 1: Create Razorpay Order ───────────────────────────────────────

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody PaymentOrderRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {

        try {
            // Check not already enrolled
            Student student = studentService.findByUserId(
                    principal.getUser().getId());

            if (enrollmentRepository.existsByStudentIdAndCourseId(
                    student.getId(), request.getCourseId())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Already enrolled in this course"));
            }

            var course = courseService.getCourseById(request.getCourseId());

            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject orderReq = new JSONObject();
            orderReq.put("amount",   coursePrice);
            orderReq.put("currency", "INR");
            orderReq.put("receipt",  "rcpt_" + request.getCourseId()
                    + "_" + student.getId());
            orderReq.put("notes", new JSONObject()
                    .put("courseId",    request.getCourseId())
                    .put("studentId",   student.getId())
                    .put("courseName",  course.getTitle()));

            Order order = client.orders.create(orderReq);

            return ResponseEntity.ok(Map.of(
                    "orderId",    order.get("id"),
                    "amount",     coursePrice,
                    "currency",   "INR",
                    "courseName", course.getTitle(),
                    "keyId",      keyId
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Could not create order: " + e.getMessage()));
        }
    }

    // ─── Step 2: Verify Payment + Enroll + Send Emails ───────────────────────

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerifyRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {

        try {
            // 1. Verify Razorpay signature
            String generated = hmacSHA256(
                    request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                    keySecret);

            if (!generated.equals(request.getRazorpaySignature())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Payment verification failed"));
            }

            // 2. Enroll student
            Student student = studentService.findByUserId(
                    principal.getUser().getId());
            var course = courseService.getCourseById(request.getCourseId());

            Enrollment enrollment = new Enrollment();
            enrollment.setStudent(student);
            enrollment.setCourse(course);
            enrollment.setStudentName(request.getStudentName());
            enrollment.setPhone(request.getPhone());
            enrollmentRepository.save(enrollment);

            // 3. Send emails asynchronously (won't block response)
            double amountPaid = coursePrice / 100.0;
            String email = student.getEmail();

            emailService.sendPaymentReceiptEmail(
                    email,
                    request.getStudentName(),
                    course.getTitle(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpayOrderId(),
                    amountPaid
            );

            emailService.sendEnrollmentEmail(
                    email,
                    request.getStudentName(),
                    course.getTitle(),
                    course.getDuration()
            );

            return ResponseEntity.ok(Map.of(
                    "message",   "Enrollment successful",
                    "paymentId", request.getRazorpayPaymentId(),
                    "course",    course.getTitle()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Enrollment failed: " + e.getMessage()));
        }
    }

    // ─── HMAC-SHA256 Signature Verification ──────────────────────────────────

    private String hmacSHA256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(), "HmacSHA256"));
        return HexFormat.of().formatHex(mac.doFinal(data.getBytes()));
    }
}