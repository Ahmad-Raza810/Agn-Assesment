package com.assesment.backend.mapper;

import com.assesment.backend.dto.EnquiryRequest;
import com.assesment.backend.dto.EnquiryResponse;
import com.assesment.backend.model.Enquiry;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = FollowUpMapper.class
)
public interface EnquiryMapper {

    EnquiryResponse toDto(Enquiry enquiry);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "followUps", ignore = true)
    Enquiry toEntity(EnquiryRequest request);
}
