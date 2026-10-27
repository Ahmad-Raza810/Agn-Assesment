package com.assesment.backend.mapper;

import com.assesment.backend.dto.FollowUpResponse;
import com.assesment.backend.model.FollowUp;
import org.mapstruct.Mapper;

    @Mapper(componentModel = "spring")
    public interface FollowUpMapper {

        FollowUpResponse toDto(FollowUp followUp);

        FollowUp toEntity(FollowUpResponse response);
    }
