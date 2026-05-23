package com.team.folders.engine;

import com.team.folders.engine.collections.CollectionsTreeAlgorithm;
import com.team.folders.engine.custom.CustomTreeAlgorithm;
import com.team.folders.engine.model.PlainNode;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class StrategyEquivalenceTest {

    private final CollectionsTreeAlgorithm collections = new CollectionsTreeAlgorithm();
    private final CustomTreeAlgorithm custom = new CustomTreeAlgorithm();

    @Test
    void bothStrategiesReturnSameDfsOrder() {
        List<String> collectionsResult = collections.traverse(data(), TraversalType.DFS).stream()
                .map(PlainNode::id)
                .toList();
        List<String> customResult = custom.traverse(data(), TraversalType.DFS).stream()
                .map(PlainNode::id)
                .toList();

        assertThat(collectionsResult).isEqualTo(customResult);
    }

    @Test
    void bothStrategiesReturnSameBfsOrder() {
        List<String> collectionsResult = collections.traverse(data(), TraversalType.BFS).stream()
                .map(PlainNode::id)
                .toList();
        List<String> customResult = custom.traverse(data(), TraversalType.BFS).stream()
                .map(PlainNode::id)
                .toList();

        assertThat(collectionsResult).isEqualTo(customResult);
    }

    @Test
    void bothStrategiesReturnSameHeight() {
        assertThat(collections.height(data())).isEqualTo(custom.height(data()));
    }

    @Test
    void bothStrategiesReturnSameDepth() {
        assertThat(collections.depth(data(), "curso"))
                .isEqualTo(custom.depth(data(), "curso"));
    }

    @Test
    void bothStrategiesReturnSamePath() {
        List<String> collectionsPath = collections.pathToNode(data(), "curso").stream()
                .map(PlainNode::id)
                .toList();
        List<String> customPath = custom.pathToNode(data(), "curso").stream()
                .map(PlainNode::id)
                .toList();

        assertThat(collectionsPath).isEqualTo(customPath);
    }

    @Test
    void bothStrategiesReturnSameAncestors() {
        List<String> collectionsAncestors = collections.ancestors(data(), "curso").stream()
                .map(PlainNode::id)
                .toList();
        List<String> customAncestors = custom.ancestors(data(), "curso").stream()
                .map(PlainNode::id)
                .toList();

        assertThat(collectionsAncestors).isEqualTo(customAncestors);
    }

    @Test
    void bothStrategiesAgreeThereAreNoCycles() {
        assertThat(collections.hasCycles(data()))
                .isEqualTo(custom.hasCycles(data()));
    }

    private List<PlainNode> data() {
        return List.of(
                new PlainNode("facultad", "Facultad de Ingenieria", "FACULTAD", null),
                new PlainNode("semestre", "Semestre 1", "SEMESTRE", "facultad"),
                new PlainNode("curso", "Programacion", "CURSO", "semestre"),
                new PlainNode("tarea", "Tarea Listas", "TAREA", "curso")
        );
    }
}