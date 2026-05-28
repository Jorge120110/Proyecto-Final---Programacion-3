package com.team.folders.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ConfigController {

    @Value("${app.tree-strategy}")
    private String strategy;

    @Value("${app.storage}")
    private String storage;

    @GetMapping("/config/current")
    public Map<String, String> currentConfig() {
        return Map.of(
                "strategy", strategy,
                "storage", storage
        );
    }
}