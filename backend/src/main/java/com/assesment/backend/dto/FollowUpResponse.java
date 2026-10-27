package com.assesment.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowUpResponse {
    private Long id;
    private String notes;
    private LocalDateTime nextFollowUpDate;
    private LocalDateTime createdAt;
}
