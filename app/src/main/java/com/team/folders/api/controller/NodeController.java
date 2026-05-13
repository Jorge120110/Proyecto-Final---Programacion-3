package com.team.folders.api.controller;

import com.team.folders.api.dto.CreateNodeRequest;
import com.team.folders.api.dto.FolderNodeResponse;
import com.team.folders.api.mapper.FolderNodeMapper;
import com.team.folders.service.TreeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/nodes")
public class NodeController {
    private final TreeService treeService;

    public NodeController(TreeService treeService) {
        this.treeService = treeService;
    }

    @PostMapping("/root")
    @ResponseStatus(HttpStatus.CREATED)
    public FolderNodeResponse createRoot(@RequestBody CreateNodeRequest request) {
        return FolderNodeMapper.toResponse(treeService.createRoot(request));
    }

    @PostMapping("/{parentId}/children")
    @ResponseStatus(HttpStatus.CREATED)
    public FolderNodeResponse addChild(@PathVariable String parentId, @RequestBody CreateNodeRequest request) {
        return FolderNodeMapper.toResponse(treeService.addChild(parentId, request));
    }

    @GetMapping("/{nodeId}/path")
    public List<FolderNodeResponse> pathToNode(@PathVariable String nodeId) {
        return treeService.pathToNode(nodeId).stream().map(FolderNodeMapper::toResponse).toList();
    }

    @GetMapping("/{nodeId}/depth")
    public int depth(@PathVariable String nodeId) {
        return treeService.depth(nodeId);
    }

    @GetMapping("/{nodeId}/ancestors")
    public List<FolderNodeResponse> ancestors(@PathVariable String nodeId) {
        return treeService.ancestors(nodeId).stream().map(FolderNodeMapper::toResponse).toList();
    }
}
