package com.omini.config;

import com.omini.service.BancoTesteSeederService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class BancoTesteSeederConfig {

    private final BancoTesteSeederService seederService;

    @Bean
    @ConditionalOnProperty(name = "omini.test-data.enabled", havingValue = "true")
    ApplicationRunner popularBancoTesteRunner() {
        return args -> seederService.popularBancoSeNecessario();
    }
}
