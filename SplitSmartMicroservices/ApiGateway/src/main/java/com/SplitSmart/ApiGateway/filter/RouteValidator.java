package com.SplitSmart.ApiGateway.filter;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerRequest;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/auth/register",
            "/auth/login",
            "/auth/validate",
            "/eureka");

    public Predicate<ServerRequest> isSecured = request -> openApiEndpoints
            .stream()
            .noneMatch(uri -> request.path().contains(uri));
}
