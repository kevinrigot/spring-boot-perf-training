package be.fgov.onerva.training.springbootperf.domain.department;

import be.fgov.onerva.training.springbootperf.domain.company.Company;
import be.fgov.onerva.training.springbootperf.domain.employee.Employee;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chief_user_id", nullable = false, referencedColumnName = "user_id")
    private Employee chief;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = false)
    private Set<Employee> employees = new HashSet<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public Employee getChief() { return chief; }
    public void setChief(Employee chief) { this.chief = chief; }

    public Set<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }
}
