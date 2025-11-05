package be.fgov.onerva.training.springbootperf.mapper;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    be.fgov.onerva.training.springbootperf.model.EmployeeLight toApi(
            be.fgov.onerva.training.springbootperf.domain.employee.Employee entity);
}
