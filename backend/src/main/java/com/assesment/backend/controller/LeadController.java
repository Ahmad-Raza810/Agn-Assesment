package com.assesment.backend.controller;

import com.assesment.backend.dto.*;
import com.assesment.backend.model.LeadStatus;
import com.assesment.backend.model.ServiceType;
import com.assesment.backend.service.EnquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final EnquiryService enquiryService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardSummary>> getDashboardSummary() {
        DashboardSummary summary = enquiryService.getDashboardSummary();
        ApiResponse<DashboardSummary> response = new ApiResponse<>(
                "Dashboard summary retrieved successfully",
                summary,
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EnquiryResponse>>> getAllLeads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<EnquiryResponse> leads = enquiryService.getAllEnquiries(page, size, sortBy, sortDir);
        ApiResponse<Page<EnquiryResponse>> response = new ApiResponse<>(
                "Leads retrieved successfully",
                leads,
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<EnquiryResponse>>> searchLeads(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) ServiceType service,
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<EnquiryResponse> leads = enquiryService.searchEnquiries(name, service, status, page, size, sortBy, sortDir);
        ApiResponse<Page<EnquiryResponse>> response = new ApiResponse<>(
                "Leads search results retrieved successfully",
                leads,
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EnquiryResponse>> getLeadById(@PathVariable Long id) {
        EnquiryResponse lead = enquiryService.getEnquiryById(id);
        ApiResponse<EnquiryResponse> response = new ApiResponse<>(
                "Lead retrieved successfully",
                lead,
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<EnquiryResponse>> updateLeadStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {

        EnquiryResponse lead = enquiryService.updateStatus(id, request);
        ApiResponse<EnquiryResponse> response = new ApiResponse<>(
                "Lead status updated successfully",
                lead,
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/follow-ups")
    public ResponseEntity<ApiResponse<EnquiryResponse>> addFollowUp(
            @PathVariable Long id,
            @Valid @RequestBody FollowUpRequest request) {

        EnquiryResponse lead = enquiryService.addFollowUp(id, request);
        ApiResponse<EnquiryResponse> response = new ApiResponse<>(
                "Follow-up added successfully",
                lead,
                HttpStatus.CREATED.value()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLead(@PathVariable Long id) {
        enquiryService.deleteEnquiry(id);
        ApiResponse<Void> response = new ApiResponse<>(
                "Lead deleted successfully",
                null,
                HttpStatus.OK.value()
        );
        return ResponseEntity.ok(response);
    }
}
