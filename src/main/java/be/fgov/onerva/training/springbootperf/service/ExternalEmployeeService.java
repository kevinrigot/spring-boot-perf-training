package be.fgov.onerva.training.springbootperf.service;

import be.fgov.onerva.training.springbootperf.model.Employee;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
@Slf4j
public class ExternalEmployeeService {

    public Employee getEmployeeByUserId(be.fgov.onerva.training.springbootperf.domain.employee.Employee employeeEntity){
        //Call an External employee service to retrieve the email and a lot of usefull stuff
        Employee employee = new Employee();
        employee.setUserId(employeeEntity.getUserId());
        employee.setFirstName(employeeEntity.getFirstName());
        employee.setLastName(employeeEntity.getLastName());
        employee.setEmail(employeeEntity.getFirstName()+"."+employeeEntity.getLastName()+"@onem.be");

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            log.error("Error while simulating external service delay", e);
            Thread.currentThread().interrupt();
        }

        return employee;
    }
}
