package com.team.folders.persistence;

import com.team.folders.domain.FolderNode;

import java.util.List;
import java.util.Optional;

public interface TreeRepository {
    FolderNode save(FolderNode node);

    List<FolderNode> findAll();

    Optional<FolderNode> findById(String id);

    boolean existsById(String id);
}
