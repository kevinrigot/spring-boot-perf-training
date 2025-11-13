package be.fgov.onerva.training.springbootperf.domain.company;

import be.fgov.onerva.training.springbootperf.domain.department.Department;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String address;

    @Column(length = 32, unique = true)
    private String vat;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = false)
    private Set<Department> departments = new HashSet<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getVat() { return vat; }
    public void setVat(String vat) { this.vat = vat; }

    public Set<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(Set<Department> departments) {
        this.departments = departments;
    }
}
