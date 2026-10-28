package com.assesment.backend.config;

import com.assesment.backend.model.ServiceType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
public class StringToServiceTypeConverter implements Converter<String, ServiceType> {

    @Override
    public ServiceType convert(@NonNull String source) {
        if (source.trim().isEmpty() || source.equalsIgnoreCase("All Services") || source.equalsIgnoreCase("ALL")) {
            return null;
        }
        return ServiceType.fromValue(source.trim());
    }
}
