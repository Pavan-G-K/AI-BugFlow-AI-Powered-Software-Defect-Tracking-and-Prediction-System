package com.bugflow.bug;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class BugController {
    private final BugService service;
    private final PredictionService predictionService;
    public BugController(BugService service, PredictionService predictionService) { this.service=service; this.predictionService=predictionService; }

    @GetMapping("/bugs") public List<Bug> list(@RequestParam(required=false) BugStatus status) { return service.list(status); }
    @GetMapping("/bugs/{id}") public Bug get(@PathVariable Long id) { return service.get(id); }
    @PostMapping("/bugs") public Bug create(@Valid @RequestBody BugRequest request) { return service.create(request); }
    @PatchMapping("/bugs/{id}/status") public Bug updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) { return service.updateStatus(id, request.status()); }
    @DeleteMapping("/bugs/{id}") public Map<String,String> delete(@PathVariable Long id) { service.delete(id); return Map.of("message","Bug deleted"); }
    @PostMapping("/predict") public Map<String,Object> predict(@RequestBody BugRequest request) { return predictionService.predict(request); }
    @GetMapping("/dashboard") public Map<String,Long> dashboard() {
        return Map.of("total",service.count(),"open",service.count(BugStatus.OPEN),
            "inProgress",service.count(BugStatus.IN_PROGRESS),"resolved",service.count(BugStatus.RESOLVED));
    }
    @GetMapping("/health") public Map<String,String> health() { return Map.of("status","UP"); }
}
