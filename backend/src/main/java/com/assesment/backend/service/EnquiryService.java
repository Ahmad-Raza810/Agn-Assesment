package com.assesment.backend.service;

import com.assesment.backend.dto.EnquiryRequest;
import com.assesment.backend.dto.EnquiryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EnquiryService {
    EnquiryResponse createEnquiry(EnquiryRequest request);

    Page<EnquiryResponse> getAllEnquiries(int page,int size,String sortBy,String sortDir);

}
