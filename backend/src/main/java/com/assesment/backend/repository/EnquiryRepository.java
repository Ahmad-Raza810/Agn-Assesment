package com.assesment.backend.repository;

import com.assesment.backend.model.Enquiry;
import com.assesment.backend.model.LeadStatus;
import com.assesment.backend.model.ServiceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    Page<Enquiry> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Enquiry> findByServiceOfInterest(ServiceType service, Pageable pageable);

    Page<Enquiry> findByStatus(LeadStatus status, Pageable pageable);

    @Query("SELECT e FROM Enquiry e WHERE " +
           "(:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:service IS NULL OR e.serviceOfInterest = :service) AND " +
           "(:status IS NULL OR e.status = :status)")
    Page<Enquiry> searchEnquiries(@Param("name") String name,
                                   @Param("service") ServiceType service,
                                   @Param("status") LeadStatus status,
                                   Pageable pageable);

    long countByStatus(LeadStatus status);

    @Query("SELECT COUNT(DISTINCT e) FROM Enquiry e JOIN e.followUps f WHERE f.nextFollowUpDate <= :date AND e.status NOT IN ('CONVERTED', 'LOST')")
    long countPendingFollowUps(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(DISTINCT e) FROM Enquiry e JOIN e.followUps f WHERE f.nextFollowUpDate < :date AND e.status NOT IN ('CONVERTED', 'LOST')")
    long countOverdueFollowUps(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(DISTINCT e) FROM Enquiry e JOIN e.followUps f WHERE f.nextFollowUpDate >= :startDate AND f.nextFollowUpDate <= :endDate AND e.status NOT IN ('CONVERTED', 'LOST')")
    long countDueTodayFollowUps(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(DISTINCT e) FROM Enquiry e JOIN e.followUps f WHERE f.nextFollowUpDate IS NOT NULL AND e.status NOT IN ('CONVERTED', 'LOST')")
    long countAllPendingFollowUps();

    @Query("SELECT COUNT(e) FROM Enquiry e WHERE e.status = com.assesment.backend.model.LeadStatus.FOLLOW_UP AND (e.followUps IS EMPTY OR NOT EXISTS (SELECT f FROM FollowUp f WHERE f.enquiry = e AND f.nextFollowUpDate IS NOT NULL))")
    long countUnscheduledFollowUps();
}
