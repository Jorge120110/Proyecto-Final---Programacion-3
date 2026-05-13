package com.team.folders.persistence.nosql;

import com.team.folders.domain.FolderNode;
import com.team.folders.persistence.TreeRepository;
import com.team.folders.persistence.nosql.entity.Neo4jNodeEntity;
import com.team.folders.persistence.nosql.jpa.Neo4jNodeSpringRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "app.storage", havingValue = "neo4j")
public class Neo4jTreeRepository implements TreeRepository {
    private final Neo4jNodeSpringRepository repository;

    public Neo4jTreeRepository(Neo4jNodeSpringRepository repository) {
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

    private Neo4jNodeEntity toEntity(FolderNode node) {
        Neo4jNodeEntity entity = new Neo4jNodeEntity();
        entity.setId(node.id());
        entity.setName(node.name());
        entity.setType(node.type());
        entity.setParentId(node.parentId());
        return entity;
    }

    private FolderNode toDomain(Neo4jNodeEntity entity) {
        return new FolderNode(entity.getId(), entity.getName(), entity.getType(), entity.getParentId());
    }
}
