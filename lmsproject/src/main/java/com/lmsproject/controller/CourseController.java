package com.lmsproject.controller;

import com.lmsproject.model.Course;
import com.lmsproject.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;

    // ─── View All ────────────────────────────────────────────────────────────

    @GetMapping
    public String getAllCourses(Model model) {
        model.addAttribute("courses", courseService.getAllCourses());
        model.addAttribute("course", new Course());      // blank form binding
        model.addAttribute("editMode", false);
        return "courses";
    }

    // ─── Add ─────────────────────────────────────────────────────────────────

    @PostMapping("/add")
    public String addCourse(
            @Valid @ModelAttribute("course") Course course,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            model.addAttribute("courses", courseService.getAllCourses());
            model.addAttribute("editMode", false);
            return "courses";
        }

        courseService.addCourse(course);
        redirectAttributes.addFlashAttribute("successMessage",
                "Course '" + course.getTitle() + "' added successfully!");
        return "redirect:/courses";
    }

    // ─── Edit (load form) ────────────────────────────────────────────────────

    @GetMapping("/edit/{id}")
    public String editCourse(@PathVariable Long id, Model model) {
        model.addAttribute("course", courseService.getCourseById(id));
        model.addAttribute("courses", courseService.getAllCourses());
        model.addAttribute("editMode", true);
        return "courses";
    }

    // ─── Update ──────────────────────────────────────────────────────────────

    @PostMapping("/update/{id}")
    public String updateCourse(
            @PathVariable Long id,
            @Valid @ModelAttribute("course") Course course,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            model.addAttribute("courses", courseService.getAllCourses());
            model.addAttribute("editMode", true);
            return "courses";
        }

        courseService.updateCourse(id, course);
        redirectAttributes.addFlashAttribute("successMessage",
                "Course updated successfully!");
        return "redirect:/courses";
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    @GetMapping("/delete/{id}")
    public String deleteCourse(@PathVariable Long id,
                               RedirectAttributes redirectAttributes) {
        courseService.deleteCourse(id);
        redirectAttributes.addFlashAttribute("successMessage",
                "Course deleted successfully!");
        return "redirect:/courses";
    }
}
