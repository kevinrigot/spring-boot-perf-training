package be.fgov.onerva.training.springbootperf.service;

import be.fgov.onerva.training.springbootperf.domain.company.Company;
import be.fgov.onerva.training.springbootperf.repository.CompanyRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {
    private final CompanyRepository repo;
    public CompanyService(CompanyRepository repo) { this.repo = repo; }

    @Transactional
    public Page<Company> search(Long id, String name, int page, int size) {
        Specification<Company> spec = Specification.allOf();
        if (id != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("id"), id));
        }
        if (name != null && !name.isBlank()) {
            String like = "%" + name.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.lower(root.get("name")), like));
        }

        Page<Company> companiesIds = repo.findAll(spec, PageRequest.of(page, size, Sort.by("id")));
        List<Company> companies = repo.findAllByIdIn(companiesIds.getContent().stream().map(Company::getId).toList());
        companies.stream().flatMap(c -> c.getDepartments().stream()).forEach(d -> d.getEmployees().size());

        return new PageImpl<>(companies, companiesIds.getPageable(), companiesIds.getTotalElements());
    }
}
