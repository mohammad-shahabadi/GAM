package ir.ac.kntu;

import org.junit.Test;
import static org.junit.Assert.*;

public class TestCase {

    @Test
    public void test1() {
        assertNull("Null", Multiplier.solve(null, null));
    }

    @Test
    public void test2() {
        String bigInt1 = "987654321";
        String bigInt2 = "123456789";
        String output = "121932631112635269";
        assertEquals("Wrong Answer", output, Multiplier.solve(bigInt1, bigInt2));
    }

    @Test
    public void test3() {
        String bigInt1 = "9274982748798274";
        String bigInt2 = "2949872984728974987";
        String output = "27360021044507317367160062054772438";
        Runtime runtime = Runtime.getRuntime();
        long usedMemoryBefore = runtime.totalMemory() - runtime.freeMemory();
        assertEquals("Wrong Answer", output, Multiplier.solve(bigInt1, bigInt2));
        long usedMemoryAfter = runtime.totalMemory() - runtime.freeMemory();
        assertTrue("Memory Limit", (usedMemoryAfter-usedMemoryBefore) < 1000000);
    }

    @Test
    public void test4() {
        String bigInt1 = "27409928784092809";
        String bigInt2 = "8278472874879";
        String output = "226912351941477449406180645111";
        Runtime runtime = Runtime.getRuntime();
        long usedMemoryBefore = runtime.totalMemory() - runtime.freeMemory();
        assertEquals("Wrong Answer", output, Multiplier.solve(bigInt1, bigInt2));
        long usedMemoryAfter = runtime.totalMemory() - runtime.freeMemory();
        assertTrue("Memory Limit", (usedMemoryAfter-usedMemoryBefore) < 1000000);
    }

    @Test
    public void test5() {
        String bigInt1 = "29846872";
        String bigInt2 = "72684678";
        String output = "2169410280627216";
        Runtime runtime = Runtime.getRuntime();
        long usedMemoryBefore = runtime.totalMemory() - runtime.freeMemory();
        assertEquals("Wrong Answer", output, Multiplier.solve(bigInt1, bigInt2));
        long usedMemoryAfter = runtime.totalMemory() - runtime.freeMemory();
        assertTrue("Memory Limit", (usedMemoryAfter-usedMemoryBefore) < 1000000);
    }

    @Test
    public void test6() {
        String bigInt1 = "8267486782";
        String bigInt2 = "7624567571";
        String output = "63036011611708346522";
        Runtime runtime = Runtime.getRuntime();
        long usedMemoryBefore = runtime.totalMemory() - runtime.freeMemory();
        assertEquals("Wrong Answer", output, Multiplier.solve(bigInt1, bigInt2));
        long usedMemoryAfter = runtime.totalMemory() - runtime.freeMemory();
        assertTrue("Memory Limit", (usedMemoryAfter-usedMemoryBefore) < 1000000);
    }

    @Test
    public void test7() {
        String bigInt1 = "8267486782";
        String bigInt2 = "7624567571";
        String output = "63036011611708346522";
        Runtime runtime = Runtime.getRuntime();
        long usedMemoryBefore = runtime.totalMemory() - runtime.freeMemory();
        assertEquals("Wrong Answer", output, Multiplier.solve(bigInt1, bigInt2));
        long usedMemoryAfter = runtime.totalMemory() - runtime.freeMemory();
        assertTrue("Memory Limit", (usedMemoryAfter-usedMemoryBefore) < 1000000);
    }

    @Test
    public void test8() {
        String bigInt1 = "8726487692826878428746746787";
        String bigInt2 = "2764547627648645647648787468";
        String output = "24124790848909649943222171086137813635929206450174865316";
        Runtime runtime = Runtime.getRuntime();
        long usedMemoryBefore = runtime.totalMemory() - runtime.freeMemory();
        assertEquals("Wrong Answer", output, Multiplier.solve(bigInt1, bigInt2));
        long usedMemoryAfter = runtime.totalMemory() - runtime.freeMemory();
        assertTrue("Memory Limit", (usedMemoryAfter-usedMemoryBefore) < 1000000);
    }

    @Test
    public void test9() {
        String bigInt1 = "536152837687267628746847662";
        String bigInt2 = "767263978172367638768668736";
        String output = "411370759152336679434209119994959638927319012334095232";
        Runtime runtime = Runtime.getRuntime();
        long usedMemoryBefore = runtime.totalMemory() - runtime.freeMemory();
        assertEquals("Wrong Answer", output, Multiplier.solve(bigInt1, bigInt2));
        long usedMemoryAfter = runtime.totalMemory() - runtime.freeMemory();
        assertTrue("Memory Limit", (usedMemoryAfter-usedMemoryBefore) < 1000000);
    }

}
