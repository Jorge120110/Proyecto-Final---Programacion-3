package com.team.folders.api.controller;

import com.team.folders.engine.TraversalType;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.service.TreeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TreeController.class)
class TreeControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TreeService treeService;

    @Test
    void traversalAcceptsDfsParameter() throws Exception {
        when(treeService.traversal(TraversalType.DFS)).thenReturn(nodes());

        mockMvc.perform(get("/tree/traversal").param("type", "DFS"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Universidad"));
    }

    @Test
    void traversalAcceptsBfsParameter() throws Exception {
        when(treeService.traversal(TraversalType.BFS)).thenReturn(nodes());

        mockMvc.perform(get("/tree/traversal").param("type", "BFS"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Universidad"));
    }

    @Test
    void traversalUsesDfsWhenParameterIsMissing() throws Exception {
        when(treeService.traversal(TraversalType.DFS)).thenReturn(nodes());

        mockMvc.perform(get("/tree/traversal"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Universidad"));
    }

    @Test
    void traversalRejectsInvalidParameter() throws Exception {
        when(treeService.traversal(any())).thenReturn(nodes());

        mockMvc.perform(get("/tree/traversal").param("type", "wrong"))
                .andExpect(status().isBadRequest());
    }

    private List<PlainNode> nodes() {
        return List.of(new PlainNode("root", "Universidad", "FOLDER", null));
    }
}
