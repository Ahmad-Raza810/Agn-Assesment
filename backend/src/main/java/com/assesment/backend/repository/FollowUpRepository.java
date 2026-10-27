package com.assesment.backend.repository;

import com.assesment.backend.model.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    List<FollowUp> findByEnquiryIdOrderByCreatedAtDesc(Long enquiryId);
}
