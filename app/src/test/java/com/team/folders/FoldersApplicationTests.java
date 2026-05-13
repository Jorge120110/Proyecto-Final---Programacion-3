package com.team.folders;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "app.storage=memory",
        "app.tree-strategy=collections"
})
class FoldersApplicationTests {
    @Test
    void contextLoads() {
    }
}
