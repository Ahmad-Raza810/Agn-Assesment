package com.assesment.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ServiceType {

    WEB_DEVELOPMENT("Web Development"),
    MOBILE_APP_DEVELOPMENT("Mobile App Development"),
    UI_UX_DESIGN("UI/UX Design"),
    CLOUD_ARCHITECTURE_DEVOPS("Cloud Architecture & DevOps"),
    ECOMMERCE_SOLUTION("E-commerce Solution"),
    ENTERPRISE_AI_INTEGRATION("Enterprise AI Integration"),
    CUSTOM_SOFTWARE_DEVELOPMENT("Custom Software Development"),
    OTHER("Other");

    private final String displayName;

    ServiceType(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static ServiceType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) return null;
        String clean = value.trim();
        for (ServiceType type : values()) {
            if (type.name().equalsIgnoreCase(clean) || type.displayName.equalsIgnoreCase(clean)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown ServiceType: " + value);
    }
}
