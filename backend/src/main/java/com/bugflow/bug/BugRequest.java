package com.bugflow.bug;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BugRequest(
    @NotBlank @Size(max=140) String title,
    @NotBlank @Size(max=3000) String description,
    @NotBlank @Size(max=100) String component,
    @NotBlank @Size(max=100) String environment,
    Severity severity
) {}
