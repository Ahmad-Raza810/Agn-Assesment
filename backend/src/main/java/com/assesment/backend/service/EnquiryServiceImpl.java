package com.assesment.backend.service;

import com.assesment.backend.dto.*;
import com.assesment.backend.execption.BadRequestException;
import com.assesment.backend.execption.ResourceNotFoundException;
import com.assesment.backend.mapper.EnquiryMapper;
import com.assesment.backend.mapper.FollowUpMapper;
import com.assesment.backend.model.Enquiry;
import com.assesment.backend.model.FollowUp;
import com.assesment.backend.model.LeadStatus;
import com.assesment.backend.model.ServiceType;
import com.assesment.backend.repository.EnquiryRepository;
import com.assesment.backend.repository.FollowUpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class EnquiryServiceImpl implements EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final FollowUpRepository followUpRepository;
    private final EnquiryMapper enquiryMapper;
    private final FollowUpMapper followUpMapper;

    @Override
    public EnquiryResponse createEnquiry(EnquiryRequest request) {
        Enquiry enquiry = enquiryMapper.toEntity(request);
        enquiry.setStatus(LeadStatus.NEW);
        Enquiry savedEnquiry = enquiryRepository.save(enquiry);
        return enquiryMapper.toDto(savedEnquiry);
    }

    @Override
    public Page<EnquiryResponse> getAllEnquiries(Pageable pageable) {
        return enquiryRepository.findAll(pageable).map(enquiryMapper::toDto);
    }

    @Override
    public Page<EnquiryResponse> getAllEnquiries(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return getAllEnquiries(pageable);
    }

    @Override
    public Page<EnquiryResponse> searchEnquiries(String name, ServiceType service, LeadStatus status, Pageable pageable) {
        String cleanName = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        return enquiryRepository.searchEnquiries(cleanName, service, status, pageable).map(enquiryMapper::toDto);
    }

    @Override
    public Page<EnquiryResponse> searchEnquiries(String name, ServiceType service, LeadStatus status, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return searchEnquiries(name, service, status, pageable);
    }

    @Override
    public EnquiryResponse getEnquiryById(Long id) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));
        return enquiryMapper.toDto(enquiry);
    }

    @Override
    public EnquiryResponse updateStatus(Long id, UpdateStatusRequest request) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));

        if (request.getStatus() == LeadStatus.FOLLOW_UP) {
            boolean hasExistingUpcomingFollowUp = enquiry.getFollowUps() != null && enquiry.getFollowUps().stream()
                    .anyMatch(f -> f.getNextFollowUpDate() != null && !f.getNextFollowUpDate().isBefore(LocalDateTime.now()));

            if (request.getNextFollowUpDate() == null && !hasExistingUpcomingFollowUp) {
                throw new BadRequestException("Next follow-up date is mandatory when status is set to FOLLOW_UP");
            }

            if (request.getNextFollowUpDate() != null) {
                FollowUp followUp = new FollowUp();
                followUp.setEnquiry(enquiry);
                followUp.setNotes(request.getNotes() != null && !request.getNotes().isBlank()
                        ? request.getNotes()
                        : "Status updated to FOLLOW_UP. Next follow-up scheduled.");
                followUp.setNextFollowUpDate(request.getNextFollowUpDate());
                followUpRepository.save(followUp);
                enquiry.getFollowUps().add(followUp);
            }
        }

        enquiry.setStatus(request.getStatus());

        if (request.getStatus() == LeadStatus.CONVERTED || request.getStatus() == LeadStatus.LOST) {
            LocalDateTime now = LocalDateTime.now();
            if (enquiry.getFollowUps() != null) {
                for (FollowUp f : enquiry.getFollowUps()) {
                    if (f.getNextFollowUpDate() != null && f.getNextFollowUpDate().isAfter(now)) {
                        f.setNextFollowUpDate(null);
                    }
                }
            }
        }

        Enquiry updatedEnquiry = enquiryRepository.save(enquiry);
        return enquiryMapper.toDto(updatedEnquiry);
    }

    @Override
    public EnquiryResponse addFollowUp(Long id, FollowUpRequest request) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));

        if (request.getNextFollowUpDate() == null) {
            throw new BadRequestException("Next follow-up date is mandatory when adding a follow-up");
        }

        FollowUp followUp = followUpMapper.toEntity(request);
        followUp.setEnquiry(enquiry);
        followUpRepository.save(followUp);

        enquiry.getFollowUps().add(followUp);

        if (enquiry.getStatus() == LeadStatus.NEW || enquiry.getStatus() == LeadStatus.CONTACTED) {
            enquiry.setStatus(LeadStatus.FOLLOW_UP);
        }

        Enquiry updatedEnquiry = enquiryRepository.save(enquiry);
        return enquiryMapper.toDto(updatedEnquiry);
    }

    @Override
    public void deleteEnquiry(Long id) {
        if (!enquiryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enquiry not found with id: " + id);
        }
        enquiryRepository.deleteById(id);
    }

    @Override
    public DashboardSummary getDashboardSummary() {
        DashboardSummary summary = new DashboardSummary();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = now.toLocalDate().atTime(23, 59, 59);

        summary.setTotalEnquiries(enquiryRepository.count());
        summary.setPendingFollowUps(enquiryRepository.countAllPendingFollowUps());
        summary.setConvertedLeads(enquiryRepository.countByStatus(LeadStatus.CONVERTED));
        summary.setNewLeads(enquiryRepository.countByStatus(LeadStatus.NEW));
        summary.setContactedLeads(enquiryRepository.countByStatus(LeadStatus.CONTACTED));
        summary.setFollowUpLeads(enquiryRepository.countByStatus(LeadStatus.FOLLOW_UP));
        summary.setLostLeads(enquiryRepository.countByStatus(LeadStatus.LOST));
        summary.setOverdueFollowUps(enquiryRepository.countOverdueFollowUps(startOfDay));
        summary.setDueTodayFollowUps(enquiryRepository.countDueTodayFollowUps(startOfDay, endOfDay));
        summary.setUnscheduledFollowUps(enquiryRepository.countUnscheduledFollowUps());

        return summary;
    }
}
