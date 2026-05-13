package com.team.folders.persistence.nosql.jpa;

import com.team.folders.persistence.nosql.entity.Neo4jNodeEntity;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface Neo4jNodeSpringRepository extends Neo4jRepository<Neo4jNodeEntity, String> {
}
