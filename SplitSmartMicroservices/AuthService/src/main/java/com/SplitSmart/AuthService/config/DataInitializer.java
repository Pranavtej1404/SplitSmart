package com.SplitSmart.AuthService.config;

import com.SplitSmart.AuthService.entity.Role;
import com.SplitSmart.AuthService.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (roleRepository.findByRoleName("USER").isEmpty()) {
                roleRepository.save(new Role(0, "USER", "Default user role"));
            }
            if (roleRepository.findByRoleName("ADMIN").isEmpty()) {
                roleRepository.save(new Role(0, "ADMIN", "Administrator role with full access"));
            }
        };
    }
}
