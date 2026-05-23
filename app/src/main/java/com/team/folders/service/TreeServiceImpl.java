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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        FolderNode root = new FolderNode(UUID.randomUUID().toString(), request.name(), typeOrDefault(request), null);
        return repository.save(root);
    }

    @Override
    public FolderNode addChild(String parentId, CreateNodeRequest request) {
        if (!repository.existsById(parentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent node does not exist: " + parentId);
        }

        FolderNode child = new FolderNode(UUID.randomUUID().toString(), request.name(), typeOrDefault(request), parentId);
        return repository.save(child);
    }

    @Override
    public List<FolderNode> findAll() {
        return repository.findAll();
    }

    @Override
    public TreeView getTree() {
        return treeAlgorithm.buildTree(allPlainNodes());
    }

    @Override
    public TreeView getSubtree(String nodeId) {
        return treeAlgorithm.buildSubtree(allPlainNodes(), nodeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Node does not exist: " + nodeId));
    }

    @Override
    public List<PlainNode> pathToNode(String nodeId) {
        return treeAlgorithm.pathToNode(allPlainNodes(), nodeId);
    }

    @Override
    public List<PlainNode> traversal(TraversalType type) {
        return treeAlgorithm.traverse(allPlainNodes(), type);
    }

    @Override
    public int height() {
        return treeAlgorithm.height(allPlainNodes());
    }

    @Override
    public int depth(String nodeId) {
        return treeAlgorithm.depth(allPlainNodes(), nodeId);
    }

    @Override
    public List<PlainNode> ancestors(String nodeId) {
        return treeAlgorithm.ancestors(allPlainNodes(), nodeId);
    }

    @Override
    public boolean isValid() {
        return !treeAlgorithm.hasCycles(allPlainNodes());
    }

    private UnsupportedOperationException pendingImplementation(String operation) {
        return new UnsupportedOperationException("TODO service orchestration: " + operation);
    }

    private List<PlainNode> allPlainNodes() {
        return repository.findAll().stream()
                .map(FolderNodeMapper::toPlainNode)
                .toList();
    }

    private FolderNodeType typeOrDefault(CreateNodeRequest request) {
        return request.type() == null ? FolderNodeType.FOLDER : request.type();
    }
}
