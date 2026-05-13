package com.team.folders.service;

import com.team.folders.api.dto.CreateNodeRequest;
import com.team.folders.api.mapper.FolderNodeMapper;
import com.team.folders.domain.FolderNode;
import com.team.folders.domain.FolderNodeType;
import com.team.folders.engine.TraversalType;
import com.team.folders.engine.TreeAlgorithmStrategy;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;
import com.team.folders.persistence.TreeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TreeServiceImpl implements TreeService {
    private final TreeRepository repository;
    private final TreeAlgorithmStrategy treeAlgorithm;

    public TreeServiceImpl(TreeRepository repository, TreeAlgorithmStrategy treeAlgorithm) {
        this.repository = repository;
        this.treeAlgorithm = treeAlgorithm;
    }

    @Override
    public FolderNode createRoot(CreateNodeRequest request) {
        if (!repository.findAll().isEmpty()) {
            throw new IllegalStateException("Root already exists");
        }
        return repository.save(new FolderNode(newId(), request.name(), safeType(request), null));
    }

    @Override
    public FolderNode addChild(String parentId, CreateNodeRequest request) {
        if (!repository.existsById(parentId)) {
            throw new IllegalArgumentException("Parent node not found: " + parentId);
        }
        return repository.save(new FolderNode(newId(), request.name(), safeType(request), parentId));
    }

    @Override
    public TreeView getTree() {
        return treeAlgorithm.buildTree(plainNodes());
    }

    @Override
    public TreeView getSubtree(String nodeId) {
        return treeAlgorithm.buildSubtree(plainNodes(), nodeId)
                .orElseThrow(() -> new IllegalArgumentException("Node not found: " + nodeId));
    }

    @Override
    public List<PlainNode> pathToNode(String nodeId) {
        return treeAlgorithm.pathToNode(plainNodes(), nodeId);
    }

    @Override
    public List<PlainNode> traversal(TraversalType type) {
        return treeAlgorithm.traverse(plainNodes(), type);
    }

    @Override
    public int height() {
        return treeAlgorithm.height(plainNodes());
    }

    @Override
    public int depth(String nodeId) {
        return treeAlgorithm.depth(plainNodes(), nodeId);
    }

    @Override
    public List<PlainNode> ancestors(String nodeId) {
        return treeAlgorithm.ancestors(plainNodes(), nodeId);
    }

    @Override
    public boolean isValid() {
        return !treeAlgorithm.hasCycles(plainNodes());
    }

    private List<PlainNode> plainNodes() {
        return repository.findAll().stream().map(FolderNodeMapper::toPlainNode).toList();
    }

    private FolderNodeType safeType(CreateNodeRequest request) {
        return request.type() == null ? FolderNodeType.FOLDER : request.type();
    }

    private String newId() {
        return UUID.randomUUID().toString();
    }
}
