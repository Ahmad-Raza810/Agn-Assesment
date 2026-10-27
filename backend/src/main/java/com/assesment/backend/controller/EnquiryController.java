package com.assesment.backend.controller;

import com.assesment.backend.dto.ApiResponse;
import com.assesment.backend.dto.EnquiryRequest;
import com.assesment.backend.dto.EnquiryResponse;
import com.assesment.backend.service.EnquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enquiries")
@RequiredArgsConstructor
public class EnquiryController {

    private final EnquiryService enquiryService;

    @PostMapping
    public ResponseEntity<ApiResponse<EnquiryResponse>> submitEnquiry(@Valid @RequestBody EnquiryRequest request) {
        EnquiryResponse enquiryResponse = enquiryService.createEnquiry(request);

        ApiResponse<EnquiryResponse> response = new ApiResponse<>(
                "Enquiry submitted successfully.",
                enquiryResponse,
                HttpStatus.CREATED.value()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
