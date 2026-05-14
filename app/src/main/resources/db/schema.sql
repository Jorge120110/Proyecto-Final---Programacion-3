CREATE TABLE IF NOT EXISTS nodes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    position INTEGER DEFAULT 0 NOT NULL,
    parent_id VARCHAR(36),
    CONSTRAINT fk_nodes_parent FOREIGN KEY (parent_id) REFERENCES nodes(id) ON DELETE CASCADE

  
);

CREATE INDEX idx_nodes_parent_id ON nodes(parent_id);
CREATE INDEX idx_nodes_type ON nodes(type);
