package be.fgov.onerva.training.springbootperf.service;

import be.fgov.onerva.training.springbootperf.domain.department.Department;
import be.fgov.onerva.training.springbootperf.repository.DepartmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService {
    private final DepartmentRepository repo;
    public DepartmentService(DepartmentRepository repo) { this.repo = repo; }

    public Page<Department> search(Long id, String name, Long companyId, int page, int size) {
        Specification<Department> spec = Specification.allOf();
        if (id != null) spec = spec.and((r, q, cb) -> cb.equal(r.get("id"), id));
        if (name != null && !name.isBlank()) {
            String like = "%" + name.toLowerCase() + "%";
            spec = spec.and((r, q, cb) -> cb.like(cb.lower(r.get("name")), like));
        }
        if (companyId != null) spec = spec.and((r, q, cb) -> cb.equal(r.get("company").get("id"), companyId));
        return repo.findAll(spec, PageRequest.of(page, size, Sort.by("id")));
    }
}
