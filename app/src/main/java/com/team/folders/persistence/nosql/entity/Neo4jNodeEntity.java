package com.team.folders.persistence.nosql.entity;

import com.team.folders.domain.FolderNodeType;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node("FolderNode")
public class Neo4jNodeEntity {
    @Id
    private String id;
    private String name;
    private FolderNodeType type;
    private String parentId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public FolderNodeType getType() {
        return type;
    }

    public void setType(FolderNodeType type) {
        this.type = type;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }
}
