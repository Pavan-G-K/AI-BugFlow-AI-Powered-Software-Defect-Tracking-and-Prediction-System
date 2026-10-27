package com.bugflow.bug;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.Map;

@Service
public class PredictionService {
    private final RestClient client;
    public PredictionService(@Value("${ml.service.url}") String url) { this.client = RestClient.builder().baseUrl(url).build(); }

    public Map<String,Object> predict(BugRequest request) {
        try {
            Map result = client.post().uri("/predict")
                .body(Map.of("title",request.title(),"description",request.description(),
                    "component",request.component(),"environment",request.environment()))
                .retrieve().body(Map.class);
            if (result != null) { result.put("source","scikit-learn model"); return result; }
        } catch (Exception ignored) { /* allow demo to work even if ML service isn't started */ }
        String text = (request.title()+" "+request.description()).toLowerCase();
        String severity = (text.contains("data loss") || text.contains("security breach") || text.contains("crash"))
            ? "CRITICAL" : (text.contains("fail") || text.contains("error") || text.contains("blocked"))
            ? "HIGH" : (text.contains("slow") || text.contains("delay")) ? "MEDIUM" : "LOW";
        return Map.of("severity",severity,"confidence",0.55,"source","fallback heuristic (ML service unavailable)");
    }
}
