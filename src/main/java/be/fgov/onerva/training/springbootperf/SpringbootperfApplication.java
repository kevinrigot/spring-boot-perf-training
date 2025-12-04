package be.fgov.onerva.training.springbootperf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SpringbootperfApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootperfApplication.class, args);
	}

}
