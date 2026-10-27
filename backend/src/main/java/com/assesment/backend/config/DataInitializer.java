package com.assesment.backend.config;

import com.assesment.backend.model.Enquiry;
import com.assesment.backend.model.FollowUp;
import com.assesment.backend.model.LeadStatus;
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
        log.info("Initializing sample enquiries...");

        // Enquiry 1 - NEW
        Enquiry enquiry1 = new Enquiry();
        enquiry1.setName("John Smith");
        enquiry1.setEmail("john.smith@example.com");
        enquiry1.setPhone("+1234567890");
        enquiry1.setServiceOfInterest("Web Development");
        enquiry1.setMessage("I need a professional website for my business");
        enquiry1.setStatus(LeadStatus.NEW);
        enquiryRepository.save(enquiry1);
        log.info("Created enquiry for: John Smith");

        // Enquiry 2 - CONTACTED
        Enquiry enquiry2 = new Enquiry();
        enquiry2.setName("Sarah Johnson");
        enquiry2.setEmail("sarah.j@example.com");
        enquiry2.setPhone("+1987654321");
        enquiry2.setServiceOfInterest("Mobile App Development");
        enquiry2.setMessage("Looking for a mobile app development team");
        enquiry2.setStatus(LeadStatus.CONTACTED);
        enquiryRepository.save(enquiry2);
        log.info("Created enquiry for: Sarah Johnson");

        // Enquiry 3 - FOLLOW_UP with follow-up notes
        Enquiry enquiry3 = new Enquiry();
        enquiry3.setName("Michael Brown");
        enquiry3.setEmail("michael.b@example.com");
        enquiry3.setPhone("+1555555555");
        enquiry3.setServiceOfInterest("E-commerce Solution");
        enquiry3.setMessage("Need an e-commerce platform with payment integration");
        enquiry3.setStatus(LeadStatus.FOLLOW_UP);

        FollowUp followUp1 = new FollowUp();
        followUp1.setEnquiry(enquiry3);
        followUp1.setNotes("Initial discussion completed. Client interested in our proposal.");
        followUp1.setNextFollowUpDate(LocalDateTime.now().plusDays(3));
        enquiry3.getFollowUps().add(followUp1);

        enquiryRepository.save(enquiry3);
        log.info("Created enquiry for: Michael Brown with follow-up");

        // Enquiry 4 - CONVERTED
        Enquiry enquiry4 = new Enquiry();
        enquiry4.setName("Emily Davis");
        enquiry4.setEmail("emily.d@example.com");
        enquiry4.setPhone("+1444444444");
        enquiry4.setServiceOfInterest("Cloud Services");
        enquiry4.setMessage("Need cloud infrastructure setup and management");
        enquiry4.setStatus(LeadStatus.CONVERTED);
        enquiryRepository.save(enquiry4);
        log.info("Created enquiry for: Emily Davis (CONVERTED)");

        // Enquiry 5 - LOST
        Enquiry enquiry5 = new Enquiry();
        enquiry5.setName("Robert Wilson");
        enquiry5.setEmail("robert.w@example.com");
        enquiry5.setPhone("+1666666666");
        enquiry5.setServiceOfInterest("SEO Services");
        enquiry5.setMessage("Interested in SEO optimization");
        enquiry5.setStatus(LeadStatus.LOST);
        enquiryRepository.save(enquiry5);
        log.info("Created enquiry for: Robert Wilson (LOST)");

        // Enquiry 6 - NEW
        Enquiry enquiry6 = new Enquiry();
        enquiry6.setName("Lisa Anderson");
        enquiry6.setEmail("lisa.a@example.com");
        enquiry6.setPhone("+1777777777");
        enquiry6.setServiceOfInterest("Web Development");
        enquiry6.setMessage("Looking for a modern website redesign");
        enquiry6.setStatus(LeadStatus.NEW);
        enquiryRepository.save(enquiry6);
        log.info("Created enquiry for: Lisa Anderson");

        log.info("Sample enquiries initialization completed");
    }
}
