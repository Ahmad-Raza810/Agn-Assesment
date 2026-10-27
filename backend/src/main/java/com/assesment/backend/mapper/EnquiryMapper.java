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

    @Mapping(target = "followUps", source = "followUps")
    Enquiry toEntity(EnquiryRequest request);
}
