package com.team.folders.persistence.memory;

import com.team.folders.domain.FolderNode;
import com.team.folders.persistence.TreeRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "app.storage", havingValue = "memory", matchIfMissing = true)
public class MemoryTreeRepository implements TreeRepository {
    private final Map<String, FolderNode> nodes = new LinkedHashMap<>();

    @Override
    public synchronized FolderNode save(FolderNode node) {
        nodes.put(node.id(), node);
        return node;
    }

    @Override
    public synchronized List<FolderNode> findAll() {
        return new ArrayList<>(nodes.values());
    }

    @Override
    public synchronized Optional<FolderNode> findById(String id) {
        return Optional.ofNullable(nodes.get(id));
    }

    @Override
    public synchronized boolean existsById(String id) {
        return nodes.containsKey(id);
    }
}
