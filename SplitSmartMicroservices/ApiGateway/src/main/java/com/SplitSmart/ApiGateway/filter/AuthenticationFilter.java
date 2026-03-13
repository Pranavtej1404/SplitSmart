package com.SplitSmart.ApiGateway.filter;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.HandlerFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@Component
public class AuthenticationFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {

    private final RouteValidator validator;
    private final RestTemplate template = new RestTemplate();

    public AuthenticationFilter(RouteValidator validator) {
        this.validator = validator;
    }

    @Override
    public ServerResponse filter(ServerRequest request, HandlerFunction<ServerResponse> next) throws Exception {
        if (request.method().name().equals("OPTIONS")) {
            return next.handle(request);
        }

        if (validator.isSecured.test(request)) {
            // Header contains token or not
            if (!request.headers().asHttpHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return ServerResponse.status(HttpStatus.UNAUTHORIZED).build();
            }

            String authHeader = request.headers().asHttpHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authHeader = authHeader.substring(7);
            }
            try {
                // Call Auth Service to validate
                // template.getForObject("http://AUTH-SERVICE/auth/validate?token=" +
                // authHeader, Boolean.class);
                // For now, since it's a simple validation, we use a direct check if we can.
                // Alternatively, the Gateway could have its own JWT utility if the secret is
                // shared.
                // Let's assume we call Auth Service.
                Boolean isValid = template.getForObject("http://localhost:8081/auth/validate?token=" + authHeader,
                        Boolean.class);
                if (isValid == null || !isValid) {
                    return ServerResponse.status(HttpStatus.UNAUTHORIZED).build();
                }
            } catch (Exception e) {
                return ServerResponse.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        return next.handle(request);
    }
}
