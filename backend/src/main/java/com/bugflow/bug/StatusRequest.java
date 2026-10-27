package com.bugflow.bug;
import jakarta.validation.constraints.NotNull;
public record StatusRequest(@NotNull BugStatus status) {}
