package com.team.folders.engine.custom;

import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.function.Consumer;

final class NodeChildren implements Iterable<TreeNode> {
    private Node first;
    private Node last;

    void add(TreeNode value) {
        Node node = new Node(value);
        if (first == null) {
            first = node;
        } else {
            last.next = node;
        }
        last = node;
    }

    TreeNode removeFirst() {
        if (first == null) {
            throw new NoSuchElementException();
        }
        TreeNode value = first.value;
        first = first.next;
        if (first == null) {
            last = null;
        }
        return value;
    }

    boolean isEmpty() {
        return first == null;
    }

    @Override
    public Iterator<TreeNode> iterator() {
        return new Iterator<>() {
            private Node current = first;

            @Override
            public boolean hasNext() {
                return current != null;
            }

            @Override
            public TreeNode next() {
                if (current == null) {
                    throw new NoSuchElementException();
                }
                TreeNode value = current.value;
                current = current.next;
                return value;
            }
        };
    }

    @Override
    public void forEach(Consumer<? super TreeNode> action) {
        for (TreeNode child : this) {
            action.accept(child);
        }
    }

    private static final class Node {
        private final TreeNode value;
        private Node next;

        private Node(TreeNode value) {
            this.value = value;
        }
    }
}
