package com.team.folders.engine;

import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;

import java.util.List;
import java.util.Optional;

public interface TreeAlgorithmStrategy {
    TreeView buildTree(List<PlainNode> nodes);

    Optional<TreeView> buildSubtree(List<PlainNode> nodes, String nodeId);

    List<PlainNode> pathToNode(List<PlainNode> nodes, String nodeId);

    List<PlainNode> traverse(List<PlainNode> nodes, TraversalType type);

    int height(List<PlainNode> nodes);

    int depth(List<PlainNode> nodes, String nodeId);

    List<PlainNode> ancestors(List<PlainNode> nodes, String nodeId);

    boolean hasCycles(List<PlainNode> nodes);
}
