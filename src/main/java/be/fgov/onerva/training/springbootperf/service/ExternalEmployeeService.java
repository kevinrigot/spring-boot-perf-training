package be.fgov.onerva.training.springbootperf.service;

import be.fgov.onerva.training.springbootperf.model.Employee;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@Slf4j
public class ExternalEmployeeService {

    private final RestClient restClient;

    public ExternalEmployeeService(@Value("${external.employee-service.url}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public Employee getEmployeeByUserId(String userId) {
        log.info("getEmployeeByUserId from external service for {}", userId);
        return restClient.get()
                .uri("/employees/{userId}", userId)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    throw new HttpClientErrorException(response.getStatusCode());
                })
                .body(Employee.class);
    }

    @Cacheable(value = "allEmployees", unless = "T(org.springframework.util.ObjectUtils).isEmpty(#result)")
    public List<Employee> getAllEmployees() {
        log.info("Fetch all employees from external service");
        return restClient.get()
                .uri("/employees")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

}
