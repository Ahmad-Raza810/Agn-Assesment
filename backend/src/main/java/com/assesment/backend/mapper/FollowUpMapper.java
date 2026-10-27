package com.assesment.backend.mapper;

import com.assesment.backend.dto.FollowUpRequest;
import com.assesment.backend.dto.FollowUpResponse;
import com.assesment.backend.model.FollowUp;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FollowUpMapper {

    FollowUpResponse toDto(FollowUp followUp);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "enquiry", ignore = true)
    FollowUp toEntity(FollowUpRequest request);

    @Mapping(target = "enquiry", ignore = true)
    FollowUp toEntity(FollowUpResponse response);
}
