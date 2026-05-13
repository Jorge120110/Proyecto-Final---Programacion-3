package com.team.folders.engine.custom;

import java.util.Iterator;
import java.util.NoSuchElementException;

final class NodeChildren implements Iterable<TreeNode> {
    // TODO: Implementar estructura propia para almacenar hijos sin usar librerias externas.

    @Override
    public Iterator<TreeNode> iterator() {
        return new Iterator<>() {
            @Override
            public boolean hasNext() {
                return false;
            }

            @Override
            public TreeNode next() {
                throw new NoSuchElementException();
            }
        };
    }
}
