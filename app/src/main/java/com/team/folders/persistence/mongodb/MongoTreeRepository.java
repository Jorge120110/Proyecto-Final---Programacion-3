package com.team.folders.persistence.mongodb;

import com.team.folders.domain.FolderNode;
import com.team.folders.persistence.TreeRepository;
import com.team.folders.persistence.mongodb.entity.MongoNodeEntity;
import com.team.folders.persistence.mongodb.jpa.MongoNodeSpringRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "app.storage", havingValue = "mongodb")
public class MongoTreeRepository implements TreeRepository {
    private final MongoNodeSpringRepository repository;

    public MongoTreeRepository(MongoNodeSpringRepository repository) {
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

    private MongoNodeEntity toEntity(FolderNode node) {
        MongoNodeEntity entity = new MongoNodeEntity();
        entity.setId(node.id());
        entity.setName(node.name());
        entity.setType(node.type());
        entity.setParentId(node.parentId());
        return entity;
    }

    private FolderNode toDomain(MongoNodeEntity entity) {
        return new FolderNode(entity.getId(), entity.getName(), entity.getType(), entity.getParentId());
    }
}
