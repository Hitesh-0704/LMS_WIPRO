package com.lmsproject.controller;

import com.lmsproject.model.Student;
import com.lmsproject.service.CourseService;
import com.lmsproject.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;
    private final CourseService courseService;

    // Helper: load shared model attributes
    private void populateModel(Model model) {
        model.addAttribute("students", studentService.getAllStudents());
        model.addAttribute("courses",  courseService.getAllCourses());
    }

    // ─── View All ────────────────────────────────────────────────────────────

    @GetMapping
    public String getAllStudents(Model model) {
        populateModel(model);
        model.addAttribute("student", new Student());
        model.addAttribute("editMode", false);
        return "students";
    }

    // ─── Add ─────────────────────────────────────────────────────────────────

    @PostMapping("/add")
    public String addStudent(
            @Valid @ModelAttribute("student") Student student,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            populateModel(model);
            model.addAttribute("editMode", false);
            return "students";
        }

        studentService.addStudent(student);
        redirectAttributes.addFlashAttribute("successMessage",
                "Student '" + student.getName() + "' added successfully!");
        return "redirect:/students";
    }

    // ─── Edit (load form) ────────────────────────────────────────────────────

    @GetMapping("/edit/{id}")
    public String editStudent(@PathVariable Long id, Model model) {
        model.addAttribute("student", studentService.getStudentById(id));
        model.addAttribute("editMode", true);
        populateModel(model);
        return "students";
    }

    // ─── Update ──────────────────────────────────────────────────────────────

    @PostMapping("/update/{id}")
    public String updateStudent(
            @PathVariable Long id,
            @Valid @ModelAttribute("student") Student student,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            populateModel(model);
            model.addAttribute("editMode", true);
            return "students";
        }

        studentService.updateStudent(id, student);
        redirectAttributes.addFlashAttribute("successMessage",
                "Student updated successfully!");
        return "redirect:/students";
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    @GetMapping("/delete/{id}")
    public String deleteStudent(@PathVariable Long id,
                                RedirectAttributes redirectAttributes) {
        studentService.deleteStudent(id);
        redirectAttributes.addFlashAttribute("successMessage",
                "Student deleted successfully!");
        return "redirect:/students";
    }

    // ─── Assign Course ────────────────────────────────────────────────────────

    @PostMapping("/assign")
    public String assignCourse(
            @RequestParam Long studentId,
            @RequestParam Long courseId,
            RedirectAttributes redirectAttributes) {

        studentService.assignCourse(studentId, courseId);
        redirectAttributes.addFlashAttribute("successMessage",
                "Course assigned successfully!");
        return "redirect:/students";
    }
}
