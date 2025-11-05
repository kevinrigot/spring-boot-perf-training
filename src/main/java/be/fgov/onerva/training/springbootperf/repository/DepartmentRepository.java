package be.fgov.onerva.training.springbootperf.repository;

import be.fgov.onerva.training.springbootperf.domain.department.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DepartmentRepository extends JpaRepository<Department, Long>, JpaSpecificationExecutor<Department> { }
