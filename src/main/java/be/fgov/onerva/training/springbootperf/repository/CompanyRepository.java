package be.fgov.onerva.training.springbootperf.repository;

import be.fgov.onerva.training.springbootperf.domain.company.Company;
import jakarta.annotation.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long>, JpaSpecificationExecutor<Company> {

    Page<Company> findAll(@Nullable Specification<Company> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"departments", "departments.chief"})
    List<Company> findAllByIdIn(List<Long> ids);
}
