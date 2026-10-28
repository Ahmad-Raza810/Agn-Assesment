package com.assesment.backend.dto;

import com.assesment.backend.model.LeadStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private LeadStatus status;

    private LocalDateTime nextFollowUpDate;

    private String notes;
}
