package be.fgov.onerva.training.springbootperf.domain.employee;

import be.fgov.onerva.training.springbootperf.domain.department.Department;
import be.fgov.onerva.training.springbootperf.domain.training.Training;
import jakarta.persistence.*;
import org.hibernate.annotations.BatchSize;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "user_id", length = 20)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "employee_trainings",
        joinColumns = @JoinColumn(name = "employee_id"),
        inverseJoinColumns = @JoinColumn(name = "training_id")
    )
    @BatchSize(size = 20)
    private Set<Training> trainings = new HashSet<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public Set<Training> getTrainings() { return trainings; }
    public void setTrainings(Set<Training> trainings) { this.trainings = trainings; }
}
