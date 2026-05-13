package com.team.folders.api.dto;

import com.team.folders.domain.FolderNodeType;

public record CreateNodeRequest(String name, FolderNodeType type) {
}
