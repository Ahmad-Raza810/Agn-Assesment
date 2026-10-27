package com.assesment.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowUpRequest {

    @NotBlank(message = "Notes are required")
    private String notes;

    private LocalDateTime nextFollowUpDate;
}
