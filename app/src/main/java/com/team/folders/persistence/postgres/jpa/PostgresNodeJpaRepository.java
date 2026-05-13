package com.team.folders.persistence.postgres.jpa;

import com.team.folders.persistence.postgres.entity.PostgresNodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostgresNodeJpaRepository extends JpaRepository<PostgresNodeEntity, String> {
}
