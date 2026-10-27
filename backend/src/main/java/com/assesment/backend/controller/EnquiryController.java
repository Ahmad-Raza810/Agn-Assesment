package com.assesment.backend.controller;

import com.assesment.backend.dto.ApiResponse;
import com.assesment.backend.dto.EnquiryRequest;
import com.assesment.backend.dto.EnquiryResponse;
import com.assesment.backend.service.EnquiryServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enquiries")
@RequiredArgsConstructor
public class EnquiryController {

    private final EnquiryServiceImpl enquiryServiceImpl;

    @PostMapping
    public ResponseEntity<ApiResponse<EnquiryResponse>> submitEnquiry(@Valid @RequestBody EnquiryRequest request) {
        EnquiryResponse enquiryResponse = enquiryServiceImpl.createEnquiry(request);

        ApiResponse<EnquiryResponse> response=new ApiResponse<>(
                "enquiry submitted successfully.",
                enquiryResponse,
                HttpStatus.CREATED.value()
        );
        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }
}
