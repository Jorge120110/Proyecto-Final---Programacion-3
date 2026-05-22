package com.team.folders.engine.collections;

import com.team.folders.engine.TraversalType;
import com.team.folders.engine.TreeAlgorithmStrategy;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class CollectionsTreeAlgorithm implements TreeAlgorithmStrategy {

    @Override
    public TreeView buildTree(List<PlainNode> nodes) {
        Map<String, List<PlainNode>> childrenByParent = groupByParent(nodes);
        PlainNode root = findRoot(nodes);
        if (root == null) {
            return null;
        }
        return buildNode(root, childrenByParent);
    }

    private TreeView buildNode(PlainNode node, Map<String, List<PlainNode>> childrenByParent) {
        List<TreeView> childrenViews = new ArrayList<>();
        List<PlainNode> children = childrenByParent.getOrDefault(node.id(), new ArrayList<>());
        for (PlainNode child : children) {
            childrenViews.add(buildNode(child, childrenByParent));
        }
        return new TreeView(node.id(), node.name(), node.type(), node.parentId(), childrenViews);
    }

    private Map<String, List<PlainNode>> groupByParent(List<PlainNode> nodes) {
        Map<String, List<PlainNode>> map = new HashMap<>();
        for (PlainNode node : nodes) {
            if (node.parentId() != null) {
                map.computeIfAbsent(node.parentId(), k -> new ArrayList<>()).add(node);
            }
        }
        return map;
    }

    private PlainNode findRoot(List<PlainNode> nodes) {
        for (PlainNode node : nodes) {
            if (node.parentId() == null) {
                return node;
            }
        }
        return null;
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