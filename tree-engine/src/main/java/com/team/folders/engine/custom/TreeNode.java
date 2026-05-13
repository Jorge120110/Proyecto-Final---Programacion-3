package com.team.folders.engine.custom;

import com.team.folders.engine.model.PlainNode;

final class TreeNode {
    private final PlainNode value;
    private final NodeChildren children;

    TreeNode(PlainNode value) {
        this.value = value;
        this.children = new NodeChildren();
    }

    PlainNode value() {
        return value;
    }

    NodeChildren children() {
        return children;
    }
}
