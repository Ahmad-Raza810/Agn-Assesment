package com.assesment.backend.dto;

import com.assesment.backend.model.LeadStatus;
import com.assesment.backend.model.ServiceType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private ServiceType serviceOfInterest;
    private String message;
    private LeadStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<FollowUpResponse> followUps;
}
