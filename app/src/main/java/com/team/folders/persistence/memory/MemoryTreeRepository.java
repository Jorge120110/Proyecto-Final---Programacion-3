package com.team.folders.persistence.memory;

import com.team.folders.domain.FolderNode;
import com.team.folders.persistence.TreeRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "app.storage", havingValue = "memory", matchIfMissing = true)
public class MemoryTreeRepository implements TreeRepository {
    @Override
    public FolderNode save(FolderNode node) {
        throw pendingImplementation("save");
    }

    @Override
    public List<FolderNode> findAll() {
        throw pendingImplementation("findAll");
    }

    @Override
    public Optional<FolderNode> findById(String id) {
        throw pendingImplementation("findById");
    }

    @Override
    public boolean existsById(String id) {
        throw pendingImplementation("existsById");
    }

    private UnsupportedOperationException pendingImplementation(String operation) {
        return new UnsupportedOperationException("TODO memory repository: " + operation);
    }
}
