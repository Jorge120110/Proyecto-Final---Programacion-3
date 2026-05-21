package com.team.folders.engine;

import com.team.folders.engine.collections.CollectionsTreeAlgorithm;
import com.team.folders.engine.model.PlainNode;
import com.team.folders.engine.model.TreeView;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class CollectionsTreeAlgorithmTest {
    private final CollectionsTreeAlgorithm algorithm = new CollectionsTreeAlgorithm();

    @Test
    void traversesFolderTreeDepthFirstWithJdkCollections() {
        List<String> names = algorithm.traverse(realFolderData(), TraversalType.DFS).stream()
                .map(PlainNode::name)
                .toList();

        assertThat(names).containsExactly(
                "Documentos",
                "Universidad",
                "Tareas",
                "tarea.pdf",
                "Fotos",
                "foto.jpg"
        );
    }

    @Test
    void traversesFolderTreeBreadthFirstWithJdkCollections() {
        List<String> names = algorithm.traverse(realFolderData(), TraversalType.BFS).stream()
                .map(PlainNode::name)
                .toList();

        assertThat(names).containsExactly(
                "Documentos",
                "Universidad",
                "Fotos",
                "Tareas",
                "foto.jpg",
                "tarea.pdf"
        );
    }

    @Test
    void detectsCyclesWithJdkCollections() {
        List<PlainNode> nodes = List.of(
                new PlainNode("documentos", "Documentos", "FOLDER", "tareas"),
                new PlainNode("universidad", "Universidad", "FOLDER", "documentos"),
                new PlainNode("tareas", "Tareas", "FOLDER", "universidad")
        );

        assertThat(algorithm.hasCycles(nodes)).isTrue();
    }

    @Test
    void calculatesFolderTreeHeightWithJdkCollections() {
        assertThat(algorithm.height(realFolderData())).isEqualTo(4);
    }

    @Test
    void calculatesNodeDepthFromRootWithJdkCollections() {
        assertThat(algorithm.depth(realFolderData(), "tarea-pdf")).isEqualTo(3);
    }

    @Test
    void returnsPathFromRootToNodeWithJdkCollections() {
        List<String> names = algorithm.pathToNode(realFolderData(), "tarea-pdf").stream()
                .map(PlainNode::name)
                .toList();

        assertThat(names).containsExactly("Documentos", "Universidad", "Tareas", "tarea.pdf");
    }

    @Test
    void returnsNodeAncestorsWithJdkCollections() {
        List<String> names = algorithm.ancestors(realFolderData(), "tarea-pdf").stream()
                .map(PlainNode::name)
                .toList();

        assertThat(names).containsExactly("Documentos", "Universidad", "Tareas");
    }

    @Test
    void buildsTreeWithJdkCollections() {
        TreeView tree = algorithm.buildTree(realFolderData());

        assertThat(tree.name()).isEqualTo("Documentos");
        assertThat(tree.children()).extracting(TreeView::name).containsExactly("Universidad", "Fotos");
        assertThat(tree.children().get(0).children()).extracting(TreeView::name).containsExactly("Tareas");
    }

    private List<PlainNode> realFolderData() {
        return List.of(
                new PlainNode("documentos", "Documentos", "FOLDER", null),
                new PlainNode("universidad", "Universidad", "FOLDER", "documentos"),
                new PlainNode("tareas", "Tareas", "FOLDER", "universidad"),
                new PlainNode("tarea-pdf", "tarea.pdf", "FILE", "tareas"),
                new PlainNode("fotos", "Fotos", "FOLDER", "documentos"),
                new PlainNode("foto-jpg", "foto.jpg", "FILE", "fotos")
        );
    }
}
