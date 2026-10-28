package com.assesment.backend.config;

import com.assesment.backend.model.ServiceType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ServiceTypeConverter implements AttributeConverter<ServiceType, String> {

    @Override
    public String convertToDatabaseColumn(ServiceType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getDisplayName();
    }

    @Override
    public ServiceType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        try {
            return ServiceType.fromValue(dbData.trim());
        } catch (IllegalArgumentException e) {
            return ServiceType.OTHER;
        }
    }
}
