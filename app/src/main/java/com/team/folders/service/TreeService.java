package com.team.folders.service;

import com.team.folders.api.dto.CreateNodeRequest;
import com.team.folders.domain.FolderNode;
import com.team.folders.engine.TraversalType;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;

import java.util.List;

public interface TreeService {
    FolderNode createRoot(CreateNodeRequest request);

    FolderNode addChild(String parentId, CreateNodeRequest request);

    TreeView getTree();

    TreeView getSubtree(String nodeId);

    List<PlainNode> pathToNode(String nodeId);

    List<PlainNode> traversal(TraversalType type);

    int height();

    int depth(String nodeId);

    List<PlainNode> ancestors(String nodeId);

    boolean isValid();
}
