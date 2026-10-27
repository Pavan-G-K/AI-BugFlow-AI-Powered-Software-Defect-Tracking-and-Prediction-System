package com.bugflow.bug;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class BugService {
    private final BugRepository repository;
    public BugService(BugRepository repository) { this.repository = repository; }
    public List<Bug> list(BugStatus status) {
        return status == null ? repository.findAllByOrderByCreatedAtDesc() : repository.findByStatusOrderByCreatedAtDesc(status);
    }
    public Bug get(Long id) { return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bug not found")); }
    public Bug create(BugRequest r) {
        return repository.save(new Bug(r.title().trim(), r.description().trim(), r.component().trim(),
            r.environment().trim(), r.severity() == null ? Severity.MEDIUM : r.severity()));
    }
    public Bug updateStatus(Long id, BugStatus status) {
        Bug bug = get(id); bug.setStatus(status); return repository.save(bug);
    }
    public void delete(Long id) { if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bug not found"); repository.deleteById(id); }
    public long count() { return repository.count(); }
    public long count(BugStatus s) { return repository.findByStatusOrderByCreatedAtDesc(s).size(); }
}
