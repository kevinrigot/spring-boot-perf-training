package be.fgov.onerva.training.springbootperf.config;

import io.micrometer.observation.ObservationRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.observation.DefaultClientRequestObservationConvention;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient restClient(ObservationRegistry observationRegistry) {
        return RestClient.builder()
                .observationRegistry(observationRegistry)
                // optional: customize observation convention
                .observationConvention(new DefaultClientRequestObservationConvention())
                .build();
    }
}