---
layout: section
color: red
---

# Solutions & Best practices
<hr>


<div class="flex justify-center">
  <div class="w-3/5">
	<img src="/images/handson.jpg"/>
	<h2>Hands on !</h2>
  </div>
</div>

---
layout: top-title
color: red
---

:: title ::
# EntityGraph: Solving N+1 Elegantly

:: content ::
### What is EntityGraph?

- JPA feature for defining graph of entities to fetch
- Declares which associations should be loaded eagerly
- More flexible than fixed fetch strategies
- Can be defined at entity or query level
- Supported natively by Spring Data JPA

---
layout: top-title-two-cols
color: red
---

:: title ::
# EntityGraph: How to use

:: left ::

### Entity Definition
```java
@Entity
@NamedEntityGraph(
    name = "Employee.withDepartmentAndTasks",
    attributeNodes = {
        @NamedAttributeNode("department"),
        @NamedAttributeNode("tasks")
    }
)
public class Employee {
    @Id
    private Long id;
    
    private String name;
    
    @ManyToOne
    private Department department;
    
    @OneToMany(mappedBy = "employee")
    private Set<Task> tasks;
    
}
```

:: right ::
### Using EntityGraph in Spring Data

```java
public interface EmployeeRepository 
    extends JpaRepository<Employee, Long> {

    // Using named entity graph
    @EntityGraph(value = "Employee.withDepartmentAndTasks")
    List<Employee> findByDepartmentName(String deptName);
    
    // Using ad-hoc entity graph
    @EntityGraph(attributePaths = {"department", "department.chief", "tasks"})
    List<Employee> findAll();
    
}
```

---
layout: top-title-two-cols
color: red
---

:: title ::
# EntityGraph: Benefits & Pitfalls

:: left ::
### Benefits

<div class="bg-green-100 rounded-lg p-4 mb-4">
  <ul class="list-disc pl-5 text-green-700">
    <li>Precise control over what's fetched</li>
    <li>Solves N+1 problem efficiently</li>    
    <li>Can be applied conditionally</li>
    <li>Works with pagination</li>
  </ul>
</div>

:: right ::
### Common Pitfalls

<div class="bg-amber-100 rounded-lg p-4 mb-4">
  <ul class="list-disc pl-5 text-amber-700">
    <li>Over-fetching with too many associations</li>
    <li>Cascading entity graphs (nested associations)</li>
    <li>Using with very large collections</li>
  </ul>
</div>

---
layout: section
color: red
---

# First exercice
<hr>

- Check out the code: https://github.com/kevinrigot/spring-boot-perf-training
- `mvn install`
- Run the app ("Run Spring boot" in the IntelliJ launch configuration)
- in api/request , run "Search companies - N+1 test case"
- Use the tools to find out the problem (spoiler alert; it's the name of the request)
- Fix it


---
layout: section
color: red
---

# Second exercice: Open Session in View
<hr>

- Disable Open session in view `spring.jpa.open-in-view: false` in `application.yaml`
- Run the app ("Run Spring boot" in the IntelliJ launch configuration)
- in api/request , run "Search companies with full list of employees - Open In View test case"
- You should get a 500.
- Fix it. 



---
layout: top-title
color: red
---

:: title ::
# @BatchSize: Optimizing Collection Fetching

:: content ::

### What is @BatchSize?
- Annotation to configure batch fetching of collections
- Reduces N+1 queries by loading multiple collections in a single query

### How does it work?
1. When you first access the collection of any parent. _eg: The list of employees of a department._
2. Hibernate identifies up to x other element (_employees_) from the collection that are in the current session
3. Loads elements for all of them in a single query
```sql
Select * FROM employees WHERE deptId IN (id1, id2, id3, ..., id20)
```
4. When you access other elements not in the first batch, it triggers another batch

<hr>

_Note: If you only access the first element, it will fetch the whole batch anyway_


---
layout: section
color: red
---

# Third exercice: BatchSize
<hr>

Instead of fetching all employees of all department of all companies, which would result in a cartesian of c * d * e.

Optimize it with batchsize.

Request is "Search companies with full list of employees - Open In View test case"


---
layout: top-title
color: red
---
:: title ::
# Strategic Caching External services

:: content ::

In modern applications, the most expensive operations are often the external api calls.

In some situation, we can avoid it.

eg: Get the employee name and firstname from HrServices

Solution: Get the full list of employees, and refresh it regularly.

```
    @Cacheable(value = "allEmployees", unless = "T(org.springframework.util.ObjectUtils).isEmpty(#result)")
```

---
layout: section
color: red
---

# Fourth exercice: Caching
<hr>

1. Run "Search employees - Caching"
2. It is slow...
3. Use `@Caching` and `ExternalEmployeeService.getAllEmployees`

---
layout: top-title
color: red
---
:: title ::
# Search and pagination

:: content ::

You might have notice the following warning during the exercices (kudos to whom did! And triple kudos to whom investigate why):
```
2025-11-13T15:16:19.419+01:00  WARN 16924 --- [company-directory] [nio-8080-exec-1] org.hibernate.orm.query: HHH90003004: 
   firstResult/maxResults specified with collection fetch; applying in memory
```


### What this means?
1. You're using pagination parameters and fetching collections
2. Hibernate is not applying the pagination at the db level as you might expect, but instead:
  - Fetching all the data from the database
  - Applying the pagination in memory after all data is loaded
	
---
layout: top-title
color: red
---
:: title ::
# Search and pagination

:: content ::
### Why is it a problem?
This approach can lead to serious performance issues and unexpected behavior:
1. Memory Usage: Your application loads the entire result set into memory, even if you only want a small page
2. Performance: The database transfers much more data than needed
3. Unexpected Results: The pagination may not work as expected because the collection joins can create multiple rows for a single entity

---
layout: top-title
color: red
---
:: title ::
# Search and pagination - How to deal with it?

:: content ::
1. Use Two Separate Queries
Split your query into two steps:
```java
// First query: Get paginated parent entities
Page<Company> findAll(@Nullable Specification<Company> spec, Pageable pageable);

// Second query: Fetch collections for the specific IDs
@EntityGraph(attributePaths = {"departments", "departments.chief"})
List<Company> findAllByIdIn(List<Long> ids);
```

Then in your service:
```java
Page<Company> companiesIds = repo.findAll(spec, PageRequest.of(page, size, Sort.by("id")));
List<Company> companies = repo.findAllByIdIn(companiesIds.getContent().stream().map(Company::getId).toList());
return new PageImpl<>(companies, companiesIds.getPageable(), companiesIds.getTotalElements());
```

---
layout: section
color: red
---

# Fifth exercice: Solve this warning
<hr>

1. First Search ids with pagination and no joins
2. Then fetch with all the entities by ids
3. Merge both response into a PageImpl