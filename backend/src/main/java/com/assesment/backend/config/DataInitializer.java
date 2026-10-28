package com.assesment.backend.config;

import com.assesment.backend.model.Enquiry;
import com.assesment.backend.model.FollowUp;
import com.assesment.backend.model.LeadStatus;
import com.assesment.backend.model.ServiceType;
import com.assesment.backend.model.Role;
import com.assesment.backend.model.User;
import com.assesment.backend.repository.EnquiryRepository;
import com.assesment.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EnquiryRepository enquiryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            initializeUsers();
        }
        if (enquiryRepository.count() == 0) {
            initializeEnquiries();
        }
    }

    private void initializeUsers() {
        log.info("Initializing admin users...");

        // Admin 1
        User admin1 = new User();
        admin1.setName("Adminone");
        admin1.setEmail("admin@example.com");
        admin1.setPassword(passwordEncoder.encode("admin123"));
        admin1.setRole(Role.ADMIN);
        userRepository.save(admin1);
        log.info("Created admin user: admin@example.com / admin123");

        // Admin 2
        User admin2 = new User();
        admin2.setName("Admintwo");
        admin2.setEmail("admin1@example.com");
        admin2.setPassword(passwordEncoder.encode("admin123"));
        admin2.setRole(Role.ADMIN);
        userRepository.save(admin2);
        log.info("Created admin user: admin1@example.com / admin123");
    }

    private void initializeEnquiries() {
        log.info("Initializing sample enquiries.");

        // Enquiry 1 - NEW
        Enquiry enquiry1 = new Enquiry();
        enquiry1.setName("John Smith");
        enquiry1.setEmail("john.smith@example.com");
        enquiry1.setPhone("+1234567890");
        enquiry1.setServiceOfInterest(ServiceType.WEB_DEVELOPMENT);
        enquiry1.setMessage("I need a professional website for my business");
        enquiry1.setStatus(LeadStatus.NEW);
        enquiryRepository.save(enquiry1);

        // Enquiry 2 - CONTACTED
        Enquiry enquiry2 = new Enquiry();
        enquiry2.setName("Sarah Johnson");
        enquiry2.setEmail("sarah.j@example.com");
        enquiry2.setPhone("+1987654321");
        enquiry2.setServiceOfInterest(ServiceType.MOBILE_APP_DEVELOPMENT);
        enquiry2.setMessage("Looking for a mobile app development team");
        enquiry2.setStatus(LeadStatus.CONTACTED);
        enquiryRepository.save(enquiry2);

        // Enquiry 3 -OVERDUE follow-up (Scheduled 2 days ago)
        Enquiry enquiry3 = new Enquiry();
        enquiry3.setName("David Miller");
        enquiry3.setEmail("david.m@example.com");
        enquiry3.setPhone("+1555123456");
        enquiry3.setServiceOfInterest(ServiceType.CUSTOM_SOFTWARE_DEVELOPMENT);
        enquiry3.setMessage("Need a custom CRM for managing real estate agents");
        enquiry3.setStatus(LeadStatus.FOLLOW_UP);

        FollowUp overdueFollowUp = new FollowUp();
        overdueFollowUp.setEnquiry(enquiry3);
        overdueFollowUp.setNotes("Sent initial architecture deck. Need to follow up on feedback.");
        overdueFollowUp.setNextFollowUpDate(LocalDateTime.now().minusDays(2).withHour(14).withMinute(0));
        enquiry3.getFollowUps().add(overdueFollowUp);
        enquiryRepository.save(enquiry3);

        // Enquiry 4 - DUE TODAY follow-up
        Enquiry enquiry4 = new Enquiry();
        enquiry4.setName("Priya Patel");
        enquiry4.setEmail("priya.p@example.com");
        enquiry4.setPhone("+1555987654");
        enquiry4.setServiceOfInterest(ServiceType.UI_UX_DESIGN);
        enquiry4.setMessage("Looking to revamp our SaaS product user experience");
        enquiry4.setStatus(LeadStatus.FOLLOW_UP);

        FollowUp dueTodayFollowUp = new FollowUp();
        dueTodayFollowUp.setEnquiry(enquiry4);
        dueTodayFollowUp.setNotes("Scheduled zoom call with product design team today.");
        dueTodayFollowUp.setNextFollowUpDate(LocalDateTime.now().withHour(16).withMinute(30));
        enquiry4.getFollowUps().add(dueTodayFollowUp);
        enquiryRepository.save(enquiry4);

        // Enquiry 5 - In Follow-up (Upcoming in 3 days)
        Enquiry enquiry5 = new Enquiry();
        enquiry5.setName("Michael Brown");
        enquiry5.setEmail("michael.b@example.com");
        enquiry5.setPhone("+1555555555");
        enquiry5.setServiceOfInterest(ServiceType.WEB_DEVELOPMENT);
        enquiry5.setMessage("Need an e-commerce platform with payment integration");
        enquiry5.setStatus(LeadStatus.FOLLOW_UP);

        FollowUp upcomingFollowUp = new FollowUp();
        upcomingFollowUp.setEnquiry(enquiry5);
        upcomingFollowUp.setNotes("Proposal sent. Follow up scheduled for next week.");
        upcomingFollowUp.setNextFollowUpDate(LocalDateTime.now().plusDays(3).withHour(11).withMinute(0));
        enquiry5.getFollowUps().add(upcomingFollowUp);
        enquiryRepository.save(enquiry5);

        log.info("Sample enquiries  initialized successfully");
    }
}
