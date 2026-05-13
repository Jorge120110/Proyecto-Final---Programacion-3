package com.team.folders.service;

import com.team.folders.api.dto.CreateNodeRequest;
import com.team.folders.domain.FolderNode;
import com.team.folders.engine.TraversalType;
import com.team.folders.engine.TreeAlgorithmStrategy;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;
import com.team.folders.persistence.TreeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
        throw pendingImplementation("createRoot");
    }

    @Override
    public FolderNode addChild(String parentId, CreateNodeRequest request) {
        throw pendingImplementation("addChild");
    }

    @Override
    public TreeView getTree() {
        throw pendingImplementation("getTree");
    }

    @Override
    public TreeView getSubtree(String nodeId) {
        throw pendingImplementation("getSubtree");
    }

    @Override
    public List<PlainNode> pathToNode(String nodeId) {
        throw pendingImplementation("pathToNode");
    }

    @Override
    public List<PlainNode> traversal(TraversalType type) {
        throw pendingImplementation("traversal");
    }

    @Override
    public int height() {
        throw pendingImplementation("height");
    }

    @Override
    public int depth(String nodeId) {
        throw pendingImplementation("depth");
    }

    @Override
    public List<PlainNode> ancestors(String nodeId) {
        throw pendingImplementation("ancestors");
    }

    @Override
    public boolean isValid() {
        throw pendingImplementation("isValid");
    }

    private UnsupportedOperationException pendingImplementation(String operation) {
        return new UnsupportedOperationException("TODO service orchestration: " + operation);
    }
}
