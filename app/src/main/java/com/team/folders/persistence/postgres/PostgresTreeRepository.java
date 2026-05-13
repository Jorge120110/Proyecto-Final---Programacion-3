package com.team.folders.persistence.postgres;

import com.team.folders.domain.FolderNode;
import com.team.folders.persistence.TreeRepository;
import com.team.folders.persistence.postgres.entity.PostgresNodeEntity;
import com.team.folders.persistence.postgres.jpa.PostgresNodeJpaRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "app.storage", havingValue = "postgres")
public class PostgresTreeRepository implements TreeRepository {
    private final PostgresNodeJpaRepository repository;

    public PostgresTreeRepository(PostgresNodeJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public FolderNode save(FolderNode node) {
        return toDomain(repository.save(toEntity(node)));
    }

    @Override
    public List<FolderNode> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<FolderNode> findById(String id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public boolean existsById(String id) {
        return repository.existsById(id);
    }

    private PostgresNodeEntity toEntity(FolderNode node) {
        PostgresNodeEntity entity = new PostgresNodeEntity();
        entity.setId(node.id());
        entity.setName(node.name());
        entity.setType(node.type());
        entity.setParentId(node.parentId());
        return entity;
    }

    private FolderNode toDomain(PostgresNodeEntity entity) {
        return new FolderNode(entity.getId(), entity.getName(), entity.getType(), entity.getParentId());
    }
}
