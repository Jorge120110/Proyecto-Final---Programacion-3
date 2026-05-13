package com.team.folders.config;

import com.team.folders.engine.TreeAlgorithmStrategy;
import com.team.folders.engine.collections.CollectionsTreeAlgorithm;
import com.team.folders.engine.custom.CustomTreeAlgorithm;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StrategyConfig {
    @Bean
    @ConditionalOnProperty(name = "app.tree-strategy", havingValue = "collections", matchIfMissing = true)
    TreeAlgorithmStrategy collectionsTreeAlgorithm() {
        return new CollectionsTreeAlgorithm();
    }

    @Bean
    @ConditionalOnProperty(name = "app.tree-strategy", havingValue = "custom")
    TreeAlgorithmStrategy customTreeAlgorithm() {
        return new CustomTreeAlgorithm();
    }
}
