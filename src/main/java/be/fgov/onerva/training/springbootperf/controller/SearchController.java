package be.fgov.onerva.training.springbootperf.controller;

import be.fgov.onerva.training.springbootperf.api.CompaniesApi;
import be.fgov.onerva.training.springbootperf.api.DepartmentsApi;
import be.fgov.onerva.training.springbootperf.api.EmployeesApi;
import be.fgov.onerva.training.springbootperf.domain.company.Company;
import be.fgov.onerva.training.springbootperf.domain.employee.Employee;
import be.fgov.onerva.training.springbootperf.mapper.CompanyMapper;
import be.fgov.onerva.training.springbootperf.model.PageCompanyDetailsResponse;
import be.fgov.onerva.training.springbootperf.model.PageCompanyResponse;
import be.fgov.onerva.training.springbootperf.model.PageEmployeeResponse;
import be.fgov.onerva.training.springbootperf.model.PageMeta;
import be.fgov.onerva.training.springbootperf.service.CompanyService;
import be.fgov.onerva.training.springbootperf.service.EmployeeService;
import be.fgov.onerva.training.springbootperf.service.ExternalEmployeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
public class SearchController implements CompaniesApi, DepartmentsApi, EmployeesApi {

    private final CompanyService companyService;
    private final EmployeeService employeeService;
    private final CompanyMapper companyMapper;
    private final ExternalEmployeeService externalEmployeeService;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<PageCompanyResponse> searchCompanies(Long id, String name, Integer page, Integer size) {
        Page<Company> p = companyService.search(id, name, nvl(page), nvlSize(size));
        PageCompanyResponse resp = new PageCompanyResponse()
                .items(p.get().map(companyMapper::toApi).toList())
                .page(toMeta(p));
        return ResponseEntity.ok(resp);
    }

    @Override
    public ResponseEntity<PageCompanyDetailsResponse> searchCompaniesDetails(Long id, String name, Integer page, Integer size) {
        Page<Company> p = companyService.search(id, name, nvl(page), nvlSize(size));
        PageCompanyDetailsResponse resp = new PageCompanyDetailsResponse()
                .items(p.get().map(companyMapper::toApiDetails).toList())
                .page(toMeta(p));
        return ResponseEntity.ok(resp);
    }


    @Override
    public ResponseEntity<PageEmployeeResponse> searchEmployees(Long id, String firstName, String lastName, Long departmentId, Long companyId, Integer page, Integer size) {
        Page<Employee> p = employeeService.search(id, firstName, lastName, departmentId, companyId, nvl(page), nvlSize(size));
        PageEmployeeResponse resp = new PageEmployeeResponse()
                .items(p.get()
                        .map(e -> externalEmployeeService.getEmployeeByUserId(e.getUserId()))
                .toList())
                .page(toMeta(p));

        return ResponseEntity.ok(resp);
    }

    private PageMeta toMeta(Page<?> p) {
        return new PageMeta()
                .page(p.getNumber())
                .size(p.getSize())
                .totalElements(p.getTotalElements())
                .totalPages(p.getTotalPages());
    }

    private int nvl(Integer v) { return v == null ? 0 : v; }
    private int nvlSize(Integer v) { return v == null ? 20 : v; }
}
