package be.fgov.onerva.training.springbootperf.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {DepartmentMapper.class})
public interface CompanyMapper {

    be.fgov.onerva.training.springbootperf.model.Company toApi(
            be.fgov.onerva.training.springbootperf.domain.company.Company entity);

    be.fgov.onerva.training.springbootperf.model.CompanyDetails toApiDetails(
            be.fgov.onerva.training.springbootperf.domain.company.Company entity);
}
