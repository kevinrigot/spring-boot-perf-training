package be.fgov.onerva.training.springbootperf.service;

import be.fgov.onerva.training.springbootperf.model.Employee;
import be.fgov.onerva.training.springbootperf.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class ExternalEmployeeService {

    private final EmployeeRepository fakeExternalService;


    public Employee getEmployeeByUserId(String userId){
        log.info("getEmployeeByUserId from external service for {}", userId);
        //Call an External employee service to retrieve the email and a lot of usefull stuff
        be.fgov.onerva.training.springbootperf.domain.employee.Employee externalEmployee = fakeExternalService.findOneByUserId(userId).orElseThrow(() -> new HttpClientErrorException(HttpStatusCode.valueOf(404)));
        Employee employee = getEmployee(externalEmployee);

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            log.error("Error while simulating external service delay", e);
            Thread.currentThread().interrupt();
        }

        return employee;
    }



    @Cacheable(value = "allEmployees", unless = "T(org.springframework.util.ObjectUtils).isEmpty(#result)")
    public List<Employee> getAllEmployees(){
        log.info("Fetch all employees from external service");

        List<be.fgov.onerva.training.springbootperf.domain.employee.Employee> all = fakeExternalService.findAll();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            log.error("Error while simulating external service delay", e);
            Thread.currentThread().interrupt();
        }

        return all.stream().map(ExternalEmployeeService::getEmployee).toList();
    }

    private static Employee getEmployee(be.fgov.onerva.training.springbootperf.domain.employee.Employee externalEmployee) {
        Employee employee = new Employee();
        employee.setUserId(externalEmployee.getUserId());
        employee.setFirstName(externalEmployee.getFirstName());
        employee.setLastName(externalEmployee.getLastName());
        employee.setEmail(externalEmployee.getFirstName()+"."+ externalEmployee.getLastName()+"@onem.be");
        return employee;
    }

}
