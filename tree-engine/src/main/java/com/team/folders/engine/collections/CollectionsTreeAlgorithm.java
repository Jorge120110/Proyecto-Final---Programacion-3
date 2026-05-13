package com.team.folders.engine.collections;

import com.team.folders.engine.TraversalType;
import com.team.folders.engine.TreeAlgorithmStrategy;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;

import java.util.List;
import java.util.Optional;

public class CollectionsTreeAlgorithm implements TreeAlgorithmStrategy {
    @Override
    public TreeView buildTree(List<PlainNode> nodes) {
        throw pendingImplementation("buildTree");
    }

    @Override
    public Optional<TreeView> buildSubtree(List<PlainNode> nodes, String nodeId) {
        throw pendingImplementation("buildSubtree");
    }

    @Override
    public List<PlainNode> pathToNode(List<PlainNode> nodes, String nodeId) {
        throw pendingImplementation("pathToNode");
    }

    @Override
    public List<PlainNode> traverse(List<PlainNode> nodes, TraversalType type) {
        throw pendingImplementation("traverse");
    }

    @Override
    public int height(List<PlainNode> nodes) {
        throw pendingImplementation("height");
    }

    @Override
    public int depth(List<PlainNode> nodes, String nodeId) {
        throw pendingImplementation("depth");
    }

    @Override
    public List<PlainNode> ancestors(List<PlainNode> nodes, String nodeId) {
        throw pendingImplementation("ancestors");
    }

    @Override
    public boolean hasCycles(List<PlainNode> nodes) {
        throw pendingImplementation("hasCycles");
    }

    private UnsupportedOperationException pendingImplementation(String operation) {
        return new UnsupportedOperationException("TODO collections strategy: " + operation);
    }
}
