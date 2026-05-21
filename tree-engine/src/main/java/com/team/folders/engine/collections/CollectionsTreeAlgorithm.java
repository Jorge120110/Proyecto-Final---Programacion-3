package com.team.folders.engine.collections;

import com.team.folders.engine.TraversalType;
import com.team.folders.engine.TreeAlgorithmStrategy;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

public class CollectionsTreeAlgorithm implements TreeAlgorithmStrategy {
    @Override
    public TreeView buildTree(List<PlainNode> nodes) {
        Map<String, List<PlainNode>> childrenByParentId = childrenByParentId(nodes);
        List<PlainNode> roots = childrenByParentId.get(null);

        if (roots.isEmpty()) {
            throw new IllegalArgumentException("Tree has no root node");
        }

        return toTreeView(roots.get(0), childrenByParentId);
    }

    @Override
    public Optional<TreeView> buildSubtree(List<PlainNode> nodes, String nodeId) {
        Map<String, PlainNode> nodesById = nodesById(nodes);
        PlainNode node = nodesById.get(nodeId);

        if (node == null) {
            return Optional.empty();
        }

        return Optional.of(toTreeView(node, childrenByParentId(nodes)));
    }

    @Override
    public List<PlainNode> pathToNode(List<PlainNode> nodes, String nodeId) {
        Map<String, PlainNode> nodesById = nodesById(nodes);
        ArrayDeque<PlainNode> path = new ArrayDeque<>();
        PlainNode current = nodesById.get(nodeId);

        while (current != null) {
            path.push(current);
            current = nodesById.get(current.parentId());
        }

        return new ArrayList<>(path);
    }

    @Override
    public List<PlainNode> traverse(List<PlainNode> nodes, TraversalType type) {
        Map<String, List<PlainNode>> childrenByParentId = childrenByParentId(nodes);
        List<PlainNode> result = new ArrayList<>();

        for (PlainNode root : childrenByParentId.get(null)) {
            if (type == TraversalType.DFS) {
                traverseDepthFirst(root, childrenByParentId, result);
            } else {
                traverseBreadthFirst(root, childrenByParentId, result);
            }
        }

        return result;
    }

    @Override
    public int height(List<PlainNode> nodes) {
        Map<String, List<PlainNode>> childrenByParentId = childrenByParentId(nodes);
        int maxHeight = 0;

        for (PlainNode root : childrenByParentId.get(null)) {
            maxHeight = Math.max(maxHeight, heightFrom(root, childrenByParentId));
        }

        return maxHeight;
    }

    @Override
    public int depth(List<PlainNode> nodes, String nodeId) {
        List<PlainNode> path = pathToNode(nodes, nodeId);
        return path.isEmpty() ? -1 : path.size() - 1;
    }

    @Override
    public List<PlainNode> ancestors(List<PlainNode> nodes, String nodeId) {
        List<PlainNode> path = pathToNode(nodes, nodeId);
        if (path.isEmpty()) {
            return List.of();
        }

        return path.subList(0, path.size() - 1);
    }

    @Override
    public boolean hasCycles(List<PlainNode> nodes) {
        Map<String, PlainNode> nodesById = new HashMap<>();

        for (PlainNode node : nodes) {
            if (node.id() == null || nodesById.containsKey(node.id())) {
                return true;
            }
            nodesById.put(node.id(), node);
        }

        Set<String> validated = new HashSet<>();
        for (PlainNode node : nodes) {
            if (hasCycleFrom(node, nodesById, new HashSet<>(), validated)) {
                return true;
            }
        }

        return false;
    }

    private UnsupportedOperationException pendingImplementation(String operation) {
        return new UnsupportedOperationException("TODO collections strategy: " + operation);
    }

    private Map<String, List<PlainNode>> childrenByParentId(List<PlainNode> nodes) {
        Map<String, List<PlainNode>> childrenByParentId = new HashMap<>();
        childrenByParentId.put(null, new ArrayList<>());

        for (PlainNode node : nodes) {
            childrenByParentId.computeIfAbsent(node.parentId(), ignored -> new ArrayList<>()).add(node);
            childrenByParentId.computeIfAbsent(node.id(), ignored -> new ArrayList<>());
        }

        return childrenByParentId;
    }

    private Map<String, PlainNode> nodesById(List<PlainNode> nodes) {
        Map<String, PlainNode> nodesById = new HashMap<>();

        for (PlainNode node : nodes) {
            nodesById.put(node.id(), node);
        }

        return nodesById;
    }

    private TreeView toTreeView(PlainNode node, Map<String, List<PlainNode>> childrenByParentId) {
        return new TreeView(
                node.id(),
                node.name(),
                node.type(),
                node.parentId(),
                childrenByParentId.get(node.id()).stream()
                        .map(child -> toTreeView(child, childrenByParentId))
                        .toList()
        );
    }

    private int heightFrom(PlainNode node, Map<String, List<PlainNode>> childrenByParentId) {
        int maxChildHeight = 0;

        for (PlainNode child : childrenByParentId.get(node.id())) {
            maxChildHeight = Math.max(maxChildHeight, heightFrom(child, childrenByParentId));
        }

        return maxChildHeight + 1;
    }

    private void traverseDepthFirst(
            PlainNode root,
            Map<String, List<PlainNode>> childrenByParentId,
            List<PlainNode> result
    ) {
        ArrayDeque<PlainNode> stack = new ArrayDeque<>();
        stack.push(root);

        while (!stack.isEmpty()) {
            PlainNode current = stack.pop();
            result.add(current);

            List<PlainNode> children = childrenByParentId.get(current.id());
            for (int i = children.size() - 1; i >= 0; i--) {
                stack.push(children.get(i));
            }
        }
    }

    private void traverseBreadthFirst(
            PlainNode root,
            Map<String, List<PlainNode>> childrenByParentId,
            List<PlainNode> result
    ) {
        ArrayDeque<PlainNode> queue = new ArrayDeque<>();
        queue.add(root);

        while (!queue.isEmpty()) {
            PlainNode current = queue.remove();
            result.add(current);
            queue.addAll(childrenByParentId.get(current.id()));
        }
    }

    private boolean hasCycleFrom(
            PlainNode node,
            Map<String, PlainNode> nodesById,
            Set<String> currentPath,
            Set<String> validated
    ) {
        if (validated.contains(node.id())) {
            return false;
        }

        if (!currentPath.add(node.id())) {
            return true;
        }

        String parentId = node.parentId();
        if (parentId != null) {
            if (parentId.equals(node.id())) {
                return true;
            }

            PlainNode parent = nodesById.get(parentId);
            if (parent != null && hasCycleFrom(parent, nodesById, currentPath, validated)) {
                return true;
            }
        }

        currentPath.remove(node.id());
        validated.add(node.id());
        return false;
    }
}
