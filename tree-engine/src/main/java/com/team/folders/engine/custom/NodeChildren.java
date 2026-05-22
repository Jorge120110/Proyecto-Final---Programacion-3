package com.team.folders.engine.custom;

import java.util.Iterator;
import java.util.NoSuchElementException;

final class NodeChildren implements Iterable<TreeNode> {
    private ChildLink first;
    private ChildLink last;

    void add(TreeNode child) {
        ChildLink newLink = new ChildLink(child);

        if (first == null) {
            first = newLink;
            last = newLink;
            return;
        }

        last.next = newLink;
        last = newLink;
    }

    @Override
    public Iterator<TreeNode> iterator() {
        return new Iterator<>() {
            private ChildLink current = first;

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

    private static final class ChildLink {
        private final TreeNode value;
        private ChildLink next;

        private ChildLink(TreeNode value) {
            this.value = value;
        }
    }
}
