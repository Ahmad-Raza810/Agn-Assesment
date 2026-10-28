package com.assesment.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummary {
    private long totalEnquiries;
    private long pendingFollowUps;
    private long convertedLeads;
    private long newLeads;
    private long contactedLeads;
    private long followUpLeads;
    private long lostLeads;
    private long overdueFollowUps;
    private long dueTodayFollowUps;
    private long unscheduledFollowUps;
}
