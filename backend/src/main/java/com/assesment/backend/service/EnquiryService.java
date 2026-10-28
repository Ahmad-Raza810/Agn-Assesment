package com.assesment.backend.service;

import com.assesment.backend.dto.*;
import com.assesment.backend.model.LeadStatus;
import com.assesment.backend.model.ServiceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EnquiryService {

    EnquiryResponse createEnquiry(EnquiryRequest request);

    Page<EnquiryResponse> getAllEnquiries(Pageable pageable);

    Page<EnquiryResponse> getAllEnquiries(int page, int size, String sortBy, String sortDir);

    Page<EnquiryResponse> searchEnquiries(String name, ServiceType service, LeadStatus status, Pageable pageable);

    Page<EnquiryResponse> searchEnquiries(String name, ServiceType service, LeadStatus status, int page, int size, String sortBy, String sortDir);

    EnquiryResponse getEnquiryById(Long id);

    EnquiryResponse updateStatus(Long id, UpdateStatusRequest request);

    EnquiryResponse addFollowUp(Long id, FollowUpRequest request);

    void deleteEnquiry(Long id);

    DashboardSummary getDashboardSummary();
}
