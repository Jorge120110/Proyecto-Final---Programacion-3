package com.team.folders.domain;

public record FolderNode(String id, String name, FolderNodeType type, String parentId) {
}
