package com.team.folders.api.mapper;

import com.team.folders.api.dto.FolderNodeResponse;
import com.team.folders.api.dto.TreeResponse;
import com.team.folders.domain.FolderNode;
import com.team.folders.domain.FolderNodeType;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;

public final class FolderNodeMapper {
    private FolderNodeMapper() {
    }

    public static PlainNode toPlainNode(FolderNode node) {
        return new PlainNode(node.id(), node.name(), node.type().name(), node.parentId());
    }

    public static FolderNodeResponse toResponse(FolderNode node) {
        return new FolderNodeResponse(node.id(), node.name(), node.type(), node.parentId());
    }

    public static FolderNodeResponse toResponse(PlainNode node) {
        return new FolderNodeResponse(node.id(), node.name(), FolderNodeType.valueOf(node.type()), node.parentId());
    }

    public static TreeResponse toResponse(TreeView tree) {
        return new TreeResponse(
                tree.id(),
                tree.name(),
                FolderNodeType.valueOf(tree.type()),
                tree.parentId(),
                tree.children().stream().map(FolderNodeMapper::toResponse).toList()
        );
    }
}
