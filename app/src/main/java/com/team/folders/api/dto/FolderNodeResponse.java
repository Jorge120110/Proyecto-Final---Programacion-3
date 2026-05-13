package com.team.folders.api.dto;

import com.team.folders.domain.FolderNodeType;

public record FolderNodeResponse(String id, String name, FolderNodeType type, String parentId) {
}
