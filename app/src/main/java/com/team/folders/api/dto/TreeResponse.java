package com.team.folders.api.dto;

import com.team.folders.domain.FolderNodeType;

import java.util.List;

public record TreeResponse(
        String id,
        String name,
        FolderNodeType type,
        String parentId,
        List<TreeResponse> children
) {
}
