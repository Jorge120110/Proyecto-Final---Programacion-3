package com.team.folders.api.controller;

import com.team.folders.api.dto.FolderNodeResponse;
import com.team.folders.api.dto.TreeResponse;
import com.team.folders.api.dto.ValidateResponse;
import com.team.folders.api.mapper.FolderNodeMapper;
import com.team.folders.engine.TraversalType;
import com.team.folders.service.TreeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tree")
public class TreeController {
    private final TreeService treeService;

    public TreeController(TreeService treeService) {
        this.treeService = treeService;
    }

    @GetMapping
    public TreeResponse getTree() {
        return FolderNodeMapper.toResponse(treeService.getTree());
    }

    @GetMapping("/{nodeId}")
    public TreeResponse getSubtree(@PathVariable String nodeId) {
        return FolderNodeMapper.toResponse(treeService.getSubtree(nodeId));
    }

    @GetMapping("/traversal")
    public List<FolderNodeResponse> traversal(@RequestParam(defaultValue = "DFS") TraversalType type) {
        return treeService.traversal(type).stream().map(FolderNodeMapper::toResponse).toList();
    }

    @GetMapping("/height")
    public int height() {
        return treeService.height();
    }

    @GetMapping("/validate")
    public ValidateResponse validate() {
        boolean valid = treeService.isValid();
        return new ValidateResponse(valid, valid ? "Tree has no cycles" : "Tree has cycles");
    }
}
