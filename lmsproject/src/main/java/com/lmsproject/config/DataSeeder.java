package com.lmsproject.config;

import com.lmsproject.model.Course;
import com.lmsproject.model.Role;
import com.lmsproject.model.Student;
import com.lmsproject.model.User;
import com.lmsproject.repository.CourseRepository;
import com.lmsproject.repository.StudentRepository;
import com.lmsproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository    userRepository;
    private final CourseRepository  courseRepository;
    private final StudentRepository studentRepository; // ✅ Cleanly injected reference field
    private final PasswordEncoder   passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("admin",              "admin123",  Role.ADMIN);
        seedUser("user@learnhub.com",  "user123",   Role.USER);
        seedCourses();
    }

    private void seedUser(String username, String rawPassword, Role role) {
        if (!userRepository.existsByUsername(username)) {
            User u = new User();
            u.setUsername(username);
            u.setPassword(passwordEncoder.encode(rawPassword));
            u.setRole(role);
            User savedUser = userRepository.save(u);

            // Dynamically seeds the parallel student identity row to support React queries
            if (role == Role.USER) {
                Student s = new Student();
                s.setName("Mugdha");
                s.setEmail(username);
                s.setUser(savedUser); // Links student row database entity directly to user_id
                studentRepository.save(s);
            }
        }
    }

    private void seedCourses() {
        if (courseRepository.count() > 0) return;

        Object[][] data = {
                {
                        "Web Development",
                        "Master modern web development from scratch. You will learn HTML5, CSS3, JavaScript ES6+, and React to build responsive, real-world web applications. This course covers frontend fundamentals, DOM manipulation, API integration, and component-based architecture.",
                        "3 Months", "U9-GFVi4Uo4", "Tech"
                },
                {
                        "Data Science",
                        "Dive deep into the world of data. Learn Python programming, data analysis with Pandas and NumPy, machine learning algorithms, data visualization with Matplotlib, and real-world ML model building. No prior experience required.",
                        "4 Months", "mkv5mxYu0Wk", "Tech"
                },
                {
                        "UI/UX Design",
                        "Learn the complete UI/UX design process from user research to final prototype. Master Figma, wireframing, design systems, user flows, accessibility principles, and how to hand off designs to developers professionally.",
                        "2 Months", "c9Wg6Cb_YlU", "Design"
                },
                {
                        "Digital Marketing",
                        "Learn how to grow businesses online. This course covers SEO, Google Ads, social media marketing, email campaigns, content strategy, analytics, and how to run data-driven marketing campaigns that convert.",
                        "2 Months", "D7SYlHVx1f8", "Marketing"
                },
                {
                        "Cybersecurity",
                        "Learn ethical hacking and cybersecurity from the ground up. Topics include network security, penetration testing, vulnerability assessment, cryptography, web application security, and industry-standard tools like Kali Linux and Metasploit.",
                        "3 Months", "nzZkKoREEGo", "Tech"
                },
                {
                        "Cloud Computing",
                        "Master cloud infrastructure with AWS and DevOps practices. Learn EC2, S3, Lambda, Docker, Kubernetes, CI/CD pipelines, Infrastructure as Code with Terraform, and how to deploy scalable production applications on the cloud.",
                        "3 Months", "M988_fsOSWo", "Tech"
                },
        };

        for (Object[] row : data) {
            Course c = new Course();
            c.setTitle((String) row[0]);
            c.setDescription((String) row[1]);
            c.setDuration((String) row[2]);
            c.setYoutubeId((String) row[3]);
            c.setCategory((String) row[4]);
            courseRepository.save(c);
        }
    }
}