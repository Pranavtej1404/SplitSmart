package com.SplitSmart.ApiGateway.config;

import com.SplitSmart.ApiGateway.filter.AuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.web.servlet.function.RequestPredicates.path;

@Configuration
public class GatewayConfig {

    @Bean
    public RouterFunction<ServerResponse> authServiceRoute(AuthenticationFilter filter) {
        return route("auth-service")
                .route(path("/auth/**"), http("http://localhost:8081"))
                .filter(filter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> groupServiceRoute(AuthenticationFilter filter) {
        return route("group-service")
                .route(path("/groups/**"), http("http://localhost:8082"))
                .filter(filter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> approvalServiceRoute(AuthenticationFilter filter) {
        return route("approval-service")
                .route(path("/approvals/**"), http("http://localhost:8083"))
                .filter(filter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> balanceServiceRoute(AuthenticationFilter filter) {
        return route("balance-service")
                .route(path("/balances/**"), http("http://localhost:8084"))
                .filter(filter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> expenseServiceRoute(AuthenticationFilter filter) {
        return route("expense-service")
                .route(path("/expenses/**"), http("http://localhost:8085"))
                .filter(filter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> fraudDetectionServiceRoute(AuthenticationFilter filter) {
        return route("fraud-detection-service")
                .route(path("/fraud/**"), http("http://localhost:8086"))
                .filter(filter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> notificationServiceRoute(AuthenticationFilter filter) {
        return route("notification-service")
                .route(path("/notifications/**"), http("http://localhost:8087"))
                .filter(filter)
                .build();
    }
}
