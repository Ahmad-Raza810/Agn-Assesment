package com.assesment.backend.controller;

import com.assesment.backend.dto.*;
import com.assesment.backend.model.LeadStatus;
import com.assesment.backend.service.EnquiryServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final EnquiryServiceImpl enquiryServiceImpl;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummary> getDashboardSummary() {
        DashboardSummary summary = enquiryServiceImpl.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EnquiryResponse>>> getAllLeads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {


        Page<EnquiryResponse> leads = enquiryServiceImpl.getAllEnquiries(page, size, sortBy, sortDir);

        ResponseEntity<ApiResponse<Page<EnquiryResponse>>> response=new ApiResponse<>(
                "enquiry submitted successfully.",
                leads,
                HttpStatus.OK.value()
        );
        return new ResponseEntity<>(response,HttpStatus.CREATED);


    }

    @GetMapping("/search")
    public ResponseEntity<Page<EnquiryResponse>> searchLeads(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String service,
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<EnquiryResponse> leads = enquiryServiceImpl.searchEnquiries(name, service, status, pageable);
        return ResponseEntity.ok(leads);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnquiryResponse> getLeadById(@PathVariable Long id) {
        EnquiryResponse lead = enquiryServiceImpl.getEnquiryById(id);
        return ResponseEntity.ok(lead);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EnquiryResponse> updateLeadStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        EnquiryResponse lead = enquiryServiceImpl.updateStatus(id, request);
        return ResponseEntity.ok(lead);
    }

    @PostMapping("/{id}/follow-ups")
    public ResponseEntity<EnquiryResponse> addFollowUp(
            @PathVariable Long id,
            @Valid @RequestBody FollowUpRequest request) {
        EnquiryResponse lead = enquiryServiceImpl.addFollowUp(id, request);
        return ResponseEntity.ok(lead);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        enquiryServiceImpl.deleteEnquiry(id);
        return ResponseEntity.noContent().build();
    }
}
