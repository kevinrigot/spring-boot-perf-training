package be.fgov.onerva.training.springbootperf.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {EmployeeMapper.class})
public interface DepartmentMapper {

    be.fgov.onerva.training.springbootperf.model.Department toApi(
            be.fgov.onerva.training.springbootperf.domain.department.Department entity);
}
