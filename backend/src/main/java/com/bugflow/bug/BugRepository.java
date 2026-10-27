package com.bugflow.bug;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BugRepository extends JpaRepository<Bug, Long> {
    List<Bug> findByStatusOrderByCreatedAtDesc(BugStatus status);
    List<Bug> findAllByOrderByCreatedAtDesc();
}
