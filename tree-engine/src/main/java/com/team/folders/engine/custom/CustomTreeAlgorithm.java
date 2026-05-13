package com.team.folders.engine.custom;

import com.team.folders.engine.TraversalType;
import com.team.folders.engine.TreeAlgorithmStrategy;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CustomTreeAlgorithm implements TreeAlgorithmStrategy {
    @Override
    public TreeView buildTree(List<PlainNode> nodes) {
        TreeNode root = buildCustomTree(nodes);
        return toView(root);
    }

    @Override
    public Optional<TreeView> buildSubtree(List<PlainNode> nodes, String nodeId) {
        TreeNode root = buildCustomTree(nodes);
        return find(root, nodeId).map(this::toView);
    }

    @Override
    public List<PlainNode> pathToNode(List<PlainNode> nodes, String nodeId) {
        TreeNode root = buildCustomTree(nodes);
        List<PlainNode> path = new ArrayList<>();
        return collectPath(root, nodeId, path) ? path : List.of();
    }

    @Override
    public List<PlainNode> traverse(List<PlainNode> nodes, TraversalType type) {
        TreeNode root = buildCustomTree(nodes);
        List<PlainNode> result = new ArrayList<>();
        if (type == TraversalType.BFS) {
            NodeChildren queue = new NodeChildren();
            queue.add(root);
            while (!queue.isEmpty()) {
                TreeNode current = queue.removeFirst();
                result.add(current.value());
                current.children().forEach(queue::add);
            }
        } else {
            dfs(root, result);
        }
        return result;
    }

    @Override
    public int height(List<PlainNode> nodes) {
        return heightOf(buildCustomTree(nodes));
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
        for (PlainNode node : nodes) {
            String parentId = node.parentId();
            int hops = 0;
            while (parentId != null) {
                if (node.id().equals(parentId) || hops > nodes.size()) {
                    return true;
                }
                parentId = parentOf(nodes, parentId);
                hops++;
            }
        }
        return false;
    }

    private TreeNode buildCustomTree(List<PlainNode> nodes) {
        PlainNode rootValue = nodes.stream()
                .filter(node -> node.parentId() == null)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Tree root not found"));
        TreeNode root = new TreeNode(rootValue);
        attachChildren(root, nodes);
        return root;
    }

    private void attachChildren(TreeNode parent, List<PlainNode> nodes) {
        for (PlainNode node : nodes) {
            if (parent.value().id().equals(node.parentId())) {
                TreeNode child = new TreeNode(node);
                parent.addChild(child);
                attachChildren(child, nodes);
            }
        }
    }

    private TreeView toView(TreeNode node) {
        List<TreeView> children = new ArrayList<>();
        node.children().forEach(child -> children.add(toView(child)));
        return new TreeView(
                node.value().id(),
                node.value().name(),
                node.value().type(),
                node.value().parentId(),
                children
        );
    }

    private Optional<TreeNode> find(TreeNode current, String nodeId) {
        if (current.value().id().equals(nodeId)) {
            return Optional.of(current);
        }
        for (TreeNode child : current.children()) {
            Optional<TreeNode> found = find(child, nodeId);
            if (found.isPresent()) {
                return found;
            }
        }
        return Optional.empty();
    }

    private boolean collectPath(TreeNode current, String nodeId, List<PlainNode> path) {
        path.add(current.value());
        if (current.value().id().equals(nodeId)) {
            return true;
        }
        for (TreeNode child : current.children()) {
            if (collectPath(child, nodeId, path)) {
                return true;
            }
        }
        path.remove(path.size() - 1);
        return false;
    }

    private void dfs(TreeNode node, List<PlainNode> result) {
        result.add(node.value());
        node.children().forEach(child -> dfs(child, result));
    }

    private int heightOf(TreeNode node) {
        if (node.children().isEmpty()) {
            return 0;
        }
        int max = 0;
        for (TreeNode child : node.children()) {
            max = Math.max(max, heightOf(child));
        }
        return 1 + max;
    }

    private String parentOf(List<PlainNode> nodes, String id) {
        for (PlainNode node : nodes) {
            if (node.id().equals(id)) {
                return node.parentId();
            }
        }
        return null;
    }
}
