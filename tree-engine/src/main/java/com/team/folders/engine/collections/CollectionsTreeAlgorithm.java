package com.team.folders.engine.collections;

import com.team.folders.engine.TraversalType;
import com.team.folders.engine.TreeAlgorithmStrategy;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Queue;
import java.util.Set;
import java.util.TreeMap;

public class CollectionsTreeAlgorithm implements TreeAlgorithmStrategy {
    @Override
    public TreeView buildTree(List<PlainNode> nodes) {
        PlainNode root = findRoot(nodes).orElseThrow(() -> new IllegalStateException("Tree root not found"));
        return buildTreeFrom(nodes, root.id());
    }

    @Override
    public Optional<TreeView> buildSubtree(List<PlainNode> nodes, String nodeId) {
        return nodes.stream()
                .filter(node -> node.id().equals(nodeId))
                .findFirst()
                .map(node -> buildTreeFrom(nodes, node.id()));
    }

    @Override
    public List<PlainNode> pathToNode(List<PlainNode> nodes, String nodeId) {
        Map<String, PlainNode> byId = indexById(nodes);
        List<PlainNode> reversed = new ArrayList<>();
        PlainNode current = byId.get(nodeId);
        while (current != null) {
            reversed.add(current);
            current = current.parentId() == null ? null : byId.get(current.parentId());
        }
        java.util.Collections.reverse(reversed);
        return reversed;
    }

    @Override
    public List<PlainNode> traverse(List<PlainNode> nodes, TraversalType type) {
        return type == TraversalType.BFS ? bfs(nodes) : dfs(nodes);
    }

    @Override
    public int height(List<PlainNode> nodes) {
        return heightOf(buildTree(nodes));
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
        Map<String, PlainNode> byId = indexById(nodes);
        for (PlainNode node : nodes) {
            Set<String> visited = new HashSet<>();
            PlainNode current = node;
            while (current != null && current.parentId() != null) {
                if (!visited.add(current.id())) {
                    return true;
                }
                current = byId.get(current.parentId());
            }
        }
        return false;
    }

    private TreeView buildTreeFrom(List<PlainNode> nodes, String rootId) {
        Map<String, List<PlainNode>> childrenByParent = groupByParent(nodes);
        return buildView(indexById(nodes).get(rootId), childrenByParent);
    }

    private TreeView buildView(PlainNode node, Map<String, List<PlainNode>> childrenByParent) {
        List<TreeView> children = childrenByParent.getOrDefault(node.id(), List.of()).stream()
                .map(child -> buildView(child, childrenByParent))
                .toList();
        return new TreeView(node.id(), node.name(), node.type(), node.parentId(), children);
    }

    private List<PlainNode> dfs(List<PlainNode> nodes) {
        List<PlainNode> result = new ArrayList<>();
        TreeView root = buildTree(nodes);
        dfs(root, result);
        return result;
    }

    private void dfs(TreeView node, List<PlainNode> result) {
        result.add(new PlainNode(node.id(), node.name(), node.type(), node.parentId()));
        node.children().forEach(child -> dfs(child, result));
    }

    private List<PlainNode> bfs(List<PlainNode> nodes) {
        List<PlainNode> result = new ArrayList<>();
        Queue<TreeView> queue = new ArrayDeque<>();
        queue.add(buildTree(nodes));
        while (!queue.isEmpty()) {
            TreeView current = queue.remove();
            result.add(new PlainNode(current.id(), current.name(), current.type(), current.parentId()));
            queue.addAll(current.children());
        }
        return result;
    }

    private int heightOf(TreeView node) {
        if (node.children().isEmpty()) {
            return 0;
        }
        return 1 + node.children().stream().mapToInt(this::heightOf).max().orElse(0);
    }

    private Optional<PlainNode> findRoot(List<PlainNode> nodes) {
        return nodes.stream().filter(node -> node.parentId() == null).findFirst();
    }

    private Map<String, PlainNode> indexById(List<PlainNode> nodes) {
        Map<String, PlainNode> byId = new TreeMap<>();
        nodes.forEach(node -> byId.put(node.id(), node));
        return byId;
    }

    private Map<String, List<PlainNode>> groupByParent(List<PlainNode> nodes) {
        Map<String, List<PlainNode>> childrenByParent = new HashMap<>();
        nodes.stream()
                .filter(node -> node.parentId() != null)
                .sorted(Comparator.comparing(PlainNode::name))
                .forEach(node -> childrenByParent
                        .computeIfAbsent(node.parentId(), ignored -> new ArrayList<>())
                        .add(node));
        return childrenByParent;
    }
}
