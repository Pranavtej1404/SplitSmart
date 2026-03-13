package com.SplitSmart.ExpenseService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(name = "balance-service")
public interface BalanceClient {

    @PostMapping("/balances/group/{groupId}/simplify")
    void simplifyBalances(@PathVariable("groupId") UUID groupId);

    @PostMapping("/balances/update")
    void updateBalance(@RequestBody UpdateBalanceRequest request);

    @lombok.Data
    class UpdateBalanceRequest {
        private UUID groupId;
        private UUID debtorId;
        private UUID creditorId;
        private java.math.BigDecimal amountChange;
    }
}
