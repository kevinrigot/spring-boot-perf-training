package be.fgov.onerva.training.springbootperf.service;

import be.fgov.onerva.training.springbootperf.domain.company.Company;
import be.fgov.onerva.training.springbootperf.repository.CompanyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {
    private final CompanyRepository repo;
    public CompanyService(CompanyRepository repo) { this.repo = repo; }

    public Page<Company> search(Long id, String name, int page, int size) {
        Specification<Company> spec = Specification.allOf();
        if (id != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("id"), id));
        }
        if (name != null && !name.isBlank()) {
            String like = "%" + name.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.lower(root.get("name")), like));
        }
        return repo.findAll(spec, PageRequest.of(page, size, Sort.by("id")));
    }
}
