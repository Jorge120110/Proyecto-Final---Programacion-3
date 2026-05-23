CREATE TABLE IF NOT EXISTS nodes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    parent_id VARCHAR(36),
    CONSTRAINT fk_nodes_parent FOREIGN KEY (parent_id) REFERENCES nodes(id)
);
