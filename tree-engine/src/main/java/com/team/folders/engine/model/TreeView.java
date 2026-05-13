package com.team.folders.engine.model;

import java.util.List;

public record TreeView(String id, String name, String type, String parentId, List<TreeView> children) {
}
