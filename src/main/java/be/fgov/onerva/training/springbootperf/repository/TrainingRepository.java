package be.fgov.onerva.training.springbootperf.repository;

import be.fgov.onerva.training.springbootperf.domain.training.Training;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingRepository extends JpaRepository<Training, Long> {
}
