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
        TreeNode root = firstRoot(buildForest(nodes));
        return toTreeView(root);
    }

    @Override
    public Optional<TreeView> buildSubtree(List<PlainNode> nodes, String nodeId) {
        TreeNodeRegistry registry = buildRegistry(nodes);
        TreeNode node = registry.find(nodeId);

        if (node == null) {
            return Optional.empty();
        }

        connectChildren(nodes, registry);
        return Optional.of(toTreeView(node));
    }

    @Override
    public List<PlainNode> pathToNode(List<PlainNode> nodes, String nodeId) {
        PlainNodeRegistry registry = new PlainNodeRegistry();
        for (PlainNode node : nodes) {
            registry.add(node);
        }

        PlainNode current = registry.find(nodeId);
        PlainNodePath path = new PlainNodePath();

        while (current != null) {
            path.push(current);
            current = registry.find(current.parentId());
        }

        return path.toList();
    }

    @Override
    public List<PlainNode> traverse(List<PlainNode> nodes, TraversalType type) {
        List<PlainNode> result = new ArrayList<>();
        for (TreeNode root : buildForest(nodes)) {
            if (type == TraversalType.DFS) {
                traverseDepthFirst(root, result);
            } else {
                traverseBreadthFirst(root, result);
            }
        }

        return result;
    }

    @Override
    public int height(List<PlainNode> nodes) {
        int maxHeight = 0;

        for (TreeNode root : buildForest(nodes)) {
            maxHeight = Math.max(maxHeight, heightFrom(root));
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
        PlainNodeRegistry registry = new PlainNodeRegistry();

        for (PlainNode node : nodes) {
            if (node.id() == null || registry.contains(node.id())) {
                return true;
            }
            registry.add(node);
        }

        IdRegistry validated = new IdRegistry();
        for (PlainNode node : nodes) {
            if (hasCycleFrom(node, registry, new IdPath(), validated)) {
                return true;
            }
        }

        return false;
    }

    private UnsupportedOperationException pendingImplementation(String operation) {
        return new UnsupportedOperationException("TODO custom strategy: " + operation);
    }

    private boolean hasCycleFrom(
            PlainNode node,
            PlainNodeRegistry registry,
            IdPath currentPath,
            IdRegistry validated
    ) {
        if (validated.contains(node.id())) {
            return false;
        }

        if (currentPath.contains(node.id())) {
            return true;
        }
        currentPath.push(node.id());

        String parentId = node.parentId();
        if (parentId != null) {
            if (parentId.equals(node.id())) {
                return true;
            }

            PlainNode parent = registry.find(parentId);
            if (parent != null && hasCycleFrom(parent, registry, currentPath, validated)) {
                return true;
            }
        }

        currentPath.pop();
        validated.add(node.id());
        return false;
    }

    private NodeChildren buildForest(List<PlainNode> nodes) {
        TreeNodeRegistry registry = buildRegistry(nodes);
        NodeChildren roots = new NodeChildren();

        for (PlainNode node : nodes) {
            TreeNode current = registry.find(node.id());
            TreeNode parent = registry.find(node.parentId());

            if (parent == null) {
                roots.add(current);
            } else {
                parent.children().add(current);
            }
        }

        return roots;
    }

    private TreeNodeRegistry buildRegistry(List<PlainNode> nodes) {
        TreeNodeRegistry registry = new TreeNodeRegistry();

        for (PlainNode node : nodes) {
            registry.add(new TreeNode(node));
        }

        return registry;
    }

    private void connectChildren(List<PlainNode> nodes, TreeNodeRegistry registry) {
        for (PlainNode node : nodes) {
            TreeNode current = registry.find(node.id());
            TreeNode parent = registry.find(node.parentId());

            if (parent != null) {
                parent.children().add(current);
            }
        }
    }

    private TreeNode firstRoot(NodeChildren roots) {
        for (TreeNode root : roots) {
            return root;
        }

        throw new IllegalArgumentException("Tree has no root node");
    }

    private TreeView toTreeView(TreeNode node) {
        List<TreeView> children = new ArrayList<>();

        for (TreeNode child : node.children()) {
            children.add(toTreeView(child));
        }

        PlainNode value = node.value();
        return new TreeView(value.id(), value.name(), value.type(), value.parentId(), children);
    }

    private int heightFrom(TreeNode node) {
        int maxChildHeight = 0;

        for (TreeNode child : node.children()) {
            maxChildHeight = Math.max(maxChildHeight, heightFrom(child));
        }

        return maxChildHeight + 1;
    }

    private void traverseDepthFirst(TreeNode node, List<PlainNode> result) {
        result.add(node.value());

        for (TreeNode child : node.children()) {
            traverseDepthFirst(child, result);
        }
    }

    private void traverseBreadthFirst(TreeNode root, List<PlainNode> result) {
        NodeQueue queue = new NodeQueue();
        queue.add(root);

        while (!queue.isEmpty()) {
            TreeNode current = queue.remove();
            result.add(current.value());

            for (TreeNode child : current.children()) {
                queue.add(child);
            }
        }
    }

    private static final class NodeQueue {
        private QueueLink first;
        private QueueLink last;

        private void add(TreeNode node) {
            QueueLink newLink = new QueueLink(node);

            if (first == null) {
                first = newLink;
                last = newLink;
                return;
            }

            last.next = newLink;
            last = newLink;
        }

        private TreeNode remove() {
            TreeNode value = first.value;
            first = first.next;

            if (first == null) {
                last = null;
            }

            return value;
        }

        private boolean isEmpty() {
            return first == null;
        }
    }

    private static final class QueueLink {
        private final TreeNode value;
        private QueueLink next;

        private QueueLink(TreeNode value) {
            this.value = value;
        }
    }

    private static final class TreeNodeRegistry {
        private TreeNodeLink first;
        private TreeNodeLink last;

        private void add(TreeNode node) {
            TreeNodeLink newLink = new TreeNodeLink(node);

            if (first == null) {
                first = newLink;
                last = newLink;
                return;
            }

            last.next = newLink;
            last = newLink;
        }

        private TreeNode find(String id) {
            TreeNodeLink current = first;
            while (current != null) {
                if (idsAreEqual(current.value.value().id(), id)) {
                    return current.value;
                }
                current = current.next;
            }

            return null;
        }
    }

    private static final class TreeNodeLink {
        private final TreeNode value;
        private TreeNodeLink next;

        private TreeNodeLink(TreeNode value) {
            this.value = value;
        }
    }

    private static final class PlainNodeRegistry {
        private PlainNodeLink first;
        private PlainNodeLink last;

        private void add(PlainNode node) {
            PlainNodeLink newLink = new PlainNodeLink(node);

            if (first == null) {
                first = newLink;
                last = newLink;
                return;
            }

            last.next = newLink;
            last = newLink;
        }

        private boolean contains(String id) {
            return find(id) != null;
        }

        private PlainNode find(String id) {
            PlainNodeLink current = first;
            while (current != null) {
                if (idsAreEqual(current.value.id(), id)) {
                    return current.value;
                }
                current = current.next;
            }

            return null;
        }
    }

    private static final class PlainNodeLink {
        private final PlainNode value;
        private PlainNodeLink next;

        private PlainNodeLink(PlainNode value) {
            this.value = value;
        }
    }

    private static final class PlainNodePath {
        private PlainNodePathLink top;

        private void push(PlainNode node) {
            PlainNodePathLink newLink = new PlainNodePathLink(node);
            newLink.next = top;
            top = newLink;
        }

        private List<PlainNode> toList() {
            List<PlainNode> nodes = new ArrayList<>();
            PlainNodePathLink current = top;

            while (current != null) {
                nodes.add(current.value);
                current = current.next;
            }

            return nodes;
        }
    }

    private static final class PlainNodePathLink {
        private final PlainNode value;
        private PlainNodePathLink next;

        private PlainNodePathLink(PlainNode value) {
            this.value = value;
        }
    }

    private static final class IdRegistry {
        private IdLink first;

        private void add(String id) {
            IdLink newLink = new IdLink(id);
            newLink.next = first;
            first = newLink;
        }

        private boolean contains(String id) {
            IdLink current = first;
            while (current != null) {
                if (idsAreEqual(current.value, id)) {
                    return true;
                }
                current = current.next;
            }

            return false;
        }
    }

    private static final class IdPath {
        private IdLink top;

        private void push(String id) {
            IdLink newLink = new IdLink(id);
            newLink.next = top;
            top = newLink;
        }

        private void pop() {
            if (top != null) {
                top = top.next;
            }
        }

        private boolean contains(String id) {
            IdLink current = top;
            while (current != null) {
                if (idsAreEqual(current.value, id)) {
                    return true;
                }
                current = current.next;
            }

            return false;
        }
    }

    private static final class IdLink {
        private final String value;
        private IdLink next;

        private IdLink(String value) {
            this.value = value;
        }
    }

    private static boolean idsAreEqual(String first, String second) {
        if (first == null) {
            return second == null;
        }

        return first.equals(second);
    }
}
