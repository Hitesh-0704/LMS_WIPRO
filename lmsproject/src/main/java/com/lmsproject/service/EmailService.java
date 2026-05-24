package com.lmsproject.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // ─── Enrollment Confirmation ──────────────────────────────────────────────

    @Async
    public void sendEnrollmentEmail(String toEmail, String studentName,
                                    String courseName, String duration) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🎓 You're enrolled in " + courseName + " — LearnHub");

            String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Enrollment Confirmation</title>
                </head>
                <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;">

                  <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
                    <tr>
                      <td align="center">

                        <!-- Card -->
                        <table width="100%%" cellpadding="0" cellspacing="0"
                               style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                          <!-- Header -->
                          <tr>
                            <td style="background:#000000;padding:36px 40px;text-align:center;">
                              <div style="font-size:32px;margin-bottom:8px;">🎓</div>
                              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">LearnHub</h1>
                              <p style="margin:6px 0 0;color:#a1a1aa;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Online Learning Platform</p>
                            </td>
                          </tr>

                          <!-- Green success bar -->
                          <tr>
                            <td style="background:#16a34a;padding:14px 40px;text-align:center;">
                              <p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;">
                                ✅ Enrollment Confirmed
                              </p>
                            </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                            <td style="padding:40px 40px 32px;">

                              <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:700;">
                                Hi %s! 👋
                              </h2>
                              <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.7;">
                                Welcome to LearnHub! You've successfully enrolled in your course. Get ready to level up your skills.
                              </p>

                              <!-- Course card -->
                              <table width="100%%" cellpadding="0" cellspacing="0"
                                     style="background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:12px;margin-bottom:28px;">
                                <tr>
                                  <td style="padding:24px 28px;">
                                    <p style="margin:0 0 4px;color:#9ca3af;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Course Enrolled</p>
                                    <h3 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:700;">%s</h3>

                                    <table width="100%%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="padding:8px 0;border-top:1px solid #e5e7eb;">
                                          <table width="100%%" cellpadding="0" cellspacing="0">
                                            <tr>
                                              <td style="color:#6b7280;font-size:13px;">⏱ Duration</td>
                                              <td align="right" style="color:#111827;font-size:13px;font-weight:600;">%s</td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="padding:8px 0;border-top:1px solid #e5e7eb;">
                                          <table width="100%%" cellpadding="0" cellspacing="0">
                                            <tr>
                                              <td style="color:#6b7280;font-size:13px;">🏆 Certificate</td>
                                              <td align="right" style="color:#16a34a;font-size:13px;font-weight:600;">Included</td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="padding:8px 0;border-top:1px solid #e5e7eb;">
                                          <table width="100%%" cellpadding="0" cellspacing="0">
                                            <tr>
                                              <td style="color:#6b7280;font-size:13px;">♾ Access</td>
                                              <td align="right" style="color:#111827;font-size:13px;font-weight:600;">Lifetime</td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>

                                  </td>
                                </tr>
                              </table>

                              <!-- What to do next -->
                              <p style="margin:0 0 16px;color:#111827;font-size:15px;font-weight:700;">What to do next:</p>
                              <table width="100%%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                                <tr>
                                  <td style="padding:8px 0;">
                                    <table cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="width:28px;height:28px;background:#eff6ff;border-radius:50%%;text-align:center;vertical-align:middle;font-size:13px;">1</td>
                                        <td style="padding-left:12px;color:#374151;font-size:14px;">Log in to your LearnHub account</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:8px 0;">
                                    <table cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="width:28px;height:28px;background:#eff6ff;border-radius:50%%;text-align:center;vertical-align:middle;font-size:13px;">2</td>
                                        <td style="padding-left:12px;color:#374151;font-size:14px;">Go to My Courses</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:8px 0;">
                                    <table cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="width:28px;height:28px;background:#eff6ff;border-radius:50%%;text-align:center;vertical-align:middle;font-size:13px;">3</td>
                                        <td style="padding-left:12px;color:#374151;font-size:14px;">Click Start Course and begin learning!</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>

                              <!-- CTA Button -->
                              <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td align="center">
                                    <a href="http://localhost:5173/registered-courses"
                                       style="display:inline-block;background:#000000;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                                      ▶ Start Learning Now
                                    </a>
                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
                              <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;">
                                Questions? Email us at
                                <a href="mailto:support@learnhub.com" style="color:#374151;text-decoration:none;font-weight:600;">support@learnhub.com</a>
                              </p>
                              <p style="margin:0;color:#d1d5db;font-size:11px;">
                                © 2026 LearnHub · Mumbai, Maharashtra
                              </p>
                            </td>
                          </tr>

                        </table>
                        <!-- End Card -->

                      </td>
                    </tr>
                  </table>

                </body>
                </html>
                """.formatted(studentName, courseName, duration);

            helper.setText(html, true);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Enrollment email failed: " + e.getMessage());
        }
    }


    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🔐 Your LearnHub Password Reset OTP");

            String html = """
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;
                        border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
              <div style="background: #000; padding: 28px; text-align: center;">
                <h1 style="color: #fff; margin: 0; font-size: 26px;">🎓 LearnHub</h1>
              </div>
              <div style="padding: 40px; text-align: center;">
                <h2 style="color: #1a1a1a;">Password Reset OTP</h2>
                <p style="color: #555;">Use the OTP below to reset your password.
                   It expires in <strong>10 minutes</strong>.</p>
                <div style="background: #f4f4f4; border-radius: 12px; padding: 24px; margin: 28px 0;">
                  <span style="font-size: 42px; font-weight: bold; letter-spacing: 12px;
                               color: #000; font-family: monospace;">%s</span>
                </div>
                <p style="color: #999; font-size: 13px;">
                  If you didn't request this, ignore this email.
                </p>
              </div>
              <div style="background: #f5f5f5; padding: 16px; text-align: center;
                          color: #aaa; font-size: 12px;">
                © 2026 LearnHub
              </div>
            </div>
            """.formatted(otp);

            helper.setText(html, true);
            mailSender.send(message);
            System.out.println("OTP for " + toEmail + " : " + otp); // console fallback

        } catch (Exception e) {
            System.err.println("OTP email failed: " + e.getMessage());
            System.out.println("OTP for " + toEmail + " : " + otp); // always print to console
        }
    }






    // ─── Payment Receipt ──────────────────────────────────────────────────────

    @Async
    public void sendPaymentReceiptEmail(String toEmail, String studentName,
                                        String courseName, String paymentId,
                                        String orderId, double amount) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("✅ Payment Receipt ₹" + String.format("%.0f", amount) + " — LearnHub");

            String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Payment Receipt</title>
                </head>
                <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;">

                  <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
                    <tr>
                      <td align="center">

                        <!-- Card -->
                        <table width="100%%" cellpadding="0" cellspacing="0"
                               style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                          <!-- Header -->
                          <tr>
                            <td style="background:#000000;padding:36px 40px;text-align:center;">
                              <div style="font-size:32px;margin-bottom:8px;">🎓</div>
                              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">LearnHub</h1>
                              <p style="margin:6px 0 0;color:#a1a1aa;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Payment Receipt</p>
                            </td>
                          </tr>

                          <!-- Amount banner -->
                          <tr>
                            <td style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:28px 40px;text-align:center;">
                              <p style="margin:0 0 4px;color:#16a34a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Amount Paid</p>
                              <p style="margin:0;color:#15803d;font-size:42px;font-weight:800;">₹%.0f</p>
                              <p style="margin:6px 0 0;color:#22c55e;font-size:13px;">✅ Payment Successful</p>
                            </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                            <td style="padding:36px 40px;">

                              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.7;">
                                Hi <strong>%s</strong>, your payment has been processed successfully. Here are your transaction details:
                              </p>

                              <!-- Receipt table -->
                              <table width="100%%" cellpadding="0" cellspacing="0"
                                     style="border:1.5px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:28px;">

                                <tr style="background:#f9fafb;">
                                  <td style="padding:14px 20px;color:#6b7280;font-size:13px;font-weight:600;width:45%%;border-bottom:1px solid #e5e7eb;">Course</td>
                                  <td style="padding:14px 20px;color:#111827;font-size:13px;font-weight:600;border-bottom:1px solid #e5e7eb;">%s</td>
                                </tr>

                                <tr>
                                  <td style="padding:14px 20px;color:#6b7280;font-size:13px;font-weight:600;border-bottom:1px solid #e5e7eb;">Amount</td>
                                  <td style="padding:14px 20px;color:#16a34a;font-size:15px;font-weight:800;border-bottom:1px solid #e5e7eb;">₹%.0f</td>
                                </tr>

                                <tr style="background:#f9fafb;">
                                  <td style="padding:14px 20px;color:#6b7280;font-size:13px;font-weight:600;border-bottom:1px solid #e5e7eb;">Payment ID</td>
                                  <td style="padding:14px 20px;color:#374151;font-size:12px;font-family:'Courier New',monospace;word-break:break-all;border-bottom:1px solid #e5e7eb;">%s</td>
                                </tr>

                                <tr>
                                  <td style="padding:14px 20px;color:#6b7280;font-size:13px;font-weight:600;">Order ID</td>
                                  <td style="padding:14px 20px;color:#374151;font-size:12px;font-family:'Courier New',monospace;word-break:break-all;">%s</td>
                                </tr>

                              </table>

                              <!-- Info box -->
                              <table width="100%%" cellpadding="0" cellspacing="0"
                                     style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:10px;margin-bottom:32px;">
                                <tr>
                                  <td style="padding:16px 20px;">
                                    <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
                                      💡 <strong>Keep this email</strong> as your official payment receipt. Your course access is now active.
                                    </p>
                                  </td>
                                </tr>
                              </table>

                              <!-- CTA Button -->
                              <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td align="center">
                                    <a href="http://localhost:5173/registered-courses"
                                       style="display:inline-block;background:#000000;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:10px;font-size:15px;font-weight:700;">
                                      ▶ Go to My Courses
                                    </a>
                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
                              <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;">
                                Questions about your payment?
                                <a href="mailto:support@learnhub.com" style="color:#374151;text-decoration:none;font-weight:600;">support@learnhub.com</a>
                              </p>
                              <p style="margin:0;color:#d1d5db;font-size:11px;">
                                © 2026 LearnHub · Mumbai, Maharashtra · Secured by Razorpay
                              </p>
                            </td>
                          </tr>

                        </table>
                        <!-- End Card -->

                      </td>
                    </tr>
                  </table>

                </body>
                </html>
                """.formatted(amount, studentName, courseName, amount, paymentId, orderId);

            helper.setText(html, true);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Receipt email failed: " + e.getMessage());
        }
    }
}