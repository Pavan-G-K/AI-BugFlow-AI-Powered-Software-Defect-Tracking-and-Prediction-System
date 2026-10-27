package com.bugflow.bug;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bugs")
public class Bug {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 140) private String title;
    @Column(nullable = false, length = 3000) private String description;
    @Column(nullable = false, length = 100) private String component;
    @Column(nullable = false, length = 100) private String environment;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Severity severity = Severity.MEDIUM;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private BugStatus status = BugStatus.OPEN;
    @Column(nullable = false) private LocalDateTime createdAt = LocalDateTime.now();

    public Bug() {}
    public Bug(String title, String description, String component, String environment, Severity severity) {
        this.title=title; this.description=description; this.component=component; this.environment=environment;
        this.severity=severity == null ? Severity.MEDIUM : severity;
        this.status=BugStatus.OPEN; this.createdAt=LocalDateTime.now();
    }
    @PrePersist void prePersist() { if (createdAt == null) createdAt = LocalDateTime.now(); }
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getTitle(){return title;} public void setTitle(String title){this.title=title;}
    public String getDescription(){return description;} public void setDescription(String description){this.description=description;}
    public String getComponent(){return component;} public void setComponent(String component){this.component=component;}
    public String getEnvironment(){return environment;} public void setEnvironment(String environment){this.environment=environment;}
    public Severity getSeverity(){return severity;} public void setSeverity(Severity severity){this.severity=severity;}
    public BugStatus getStatus(){return status;} public void setStatus(BugStatus status){this.status=status;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime createdAt){this.createdAt=createdAt;}
}
