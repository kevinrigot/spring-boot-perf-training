package be.fgov.onerva.training.springbootperf.service;

import be.fgov.onerva.training.springbootperf.domain.employee.Employee;
import be.fgov.onerva.training.springbootperf.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
    private final EmployeeRepository repo;
    public EmployeeService(EmployeeRepository repo) { this.repo = repo; }

    public Page<Employee> search(Long id, String firstName, String lastName, Long departmentId, Long companyId, int page, int size) {
        Specification<Employee> spec = Specification.allOf();
        if (id != null) spec = spec.and((r, q, cb) -> cb.equal(r.get("id"), id));
        if (firstName != null && !firstName.isBlank()) {
            String like = "%" + firstName.toLowerCase() + "%";
            spec = spec.and((r, q, cb) -> cb.like(cb.lower(r.get("firstName")), like));
        }
        if (lastName != null && !lastName.isBlank()) {
            String like = "%" + lastName.toLowerCase() + "%";
            spec = spec.and((r, q, cb) -> cb.like(cb.lower(r.get("lastName")), like));
        }
        if (departmentId != null) spec = spec.and((r, q, cb) -> cb.equal(r.get("department").get("id"), departmentId));
        if (companyId != null) spec = spec.and((r, q, cb) -> cb.equal(r.get("department").get("company").get("id"), companyId));
        return repo.findAll(spec, PageRequest.of(page, size, Sort.by("id")));
    }
}
