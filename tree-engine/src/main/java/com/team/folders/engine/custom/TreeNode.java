package com.team.folders.engine.custom;

import com.team.folders.engine.model.PlainNode;

final class TreeNode {
    private final PlainNode value;
    private final NodeChildren children = new NodeChildren();

    TreeNode(PlainNode value) {
        this.value = value;
    }

    PlainNode value() {
        return value;
    }

    NodeChildren children() {
        return children;
    }

    void addChild(TreeNode child) {
        children.add(child);
    }
}
