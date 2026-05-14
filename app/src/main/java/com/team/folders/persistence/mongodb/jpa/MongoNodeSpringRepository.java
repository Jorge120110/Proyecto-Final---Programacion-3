package com.team.folders.persistence.mongodb.jpa;

import com.team.folders.persistence.mongodb.entity.MongoNodeEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoNodeSpringRepository extends MongoRepository<MongoNodeEntity, String> {
} 