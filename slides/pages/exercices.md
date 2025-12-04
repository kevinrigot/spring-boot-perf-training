### N+1 Problem
1. in api/request , run "Search companies - N+1 test case"
2. Use the tools to find out the problem (spoiler alert; it's the name of the request)
3. Fix it

```
- Enable show-sql

CompanyRepository:
    @EntityGraph(attributePaths = {"departments", "departments.chief"})
    Page<Company> findAll(@Nullable Specification<Company> spec, Pageable pageable);

```

### Open Session in View
1. Disable Open session in view `spring.jpa.open-in-view: false` in `application.yaml`
2. in api/request , run "Search companies with full list of employees - Open In View test case"
3. You should get a 500.
4. Fix it. Don't deal with the n+1 query problem for now

```
Disable OIV
- In CompanyService.search
	- Add @Transactional 
	- Update
	Page<Company> companies = repo.findAll(spec, PageRequest.of(page, size, Sort.by("id")));
	companies.get().flatMap(c -> c.getDepartments().stream()).forEach(d -> d.getEmployees().size());
	return companies;

```

### BatchSize
1. in api/request , run "Search companies with full list of employees - Open In View test case"

```
- add @BatchSize(size = 20) in Department.java List employees
```


### Cacheable
    @Override
    public ResponseEntity<PageEmployeeResponse> searchEmployees(Long id, String firstName, String lastName, Long departmentId, Long companyId, Integer page, Integer size) {
        Page<Employee> p = employeeService.search(id, firstName, lastName, departmentId, companyId, nvl(page), nvlSize(size));
        List<be.fgov.onerva.training.springbootperf.model.Employee> allEmployees = externalEmployeeService.getAllEmployees();
        PageEmployeeResponse resp = new PageEmployeeResponse()
                .items(p.get()
                        .map(e -> allEmployees.stream()
                                    .filter(ext -> ext.getUserId().equals(e.getUserId()))
                                    .findFirst()
                                    .orElseThrow(() -> new IllegalArgumentException(""))
                        )
                .toList())
                .page(toMeta(p));

        return ResponseEntity.ok(resp);
    }

### warning
CompanyRepository
```
    Page<Company> findAll(@Nullable Specification<Company> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"departments", "departments.chief"})
    List<Company> findAllByIdIn(List<Long> ids);
```

CompanyService
```
        Page<Company> companiesIds = repo.findAll(spec, PageRequest.of(page, size, Sort.by("id")));
        List<Company> companies = repo.findAllByIdIn(companiesIds.getContent().stream().map(Company::getId).toList());
        companies.stream().flatMap(c -> c.getDepartments().stream()).forEach(d -> d.getEmployees().size());

        return new PageImpl<>(companies, companiesIds.getPageable(), companiesIds.getTotalElements());
```