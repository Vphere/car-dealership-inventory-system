package com.dealership.inventory;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Full Spring context integration test.
 * Requires a running PostgreSQL instance (start via docker-compose up -d).
 * Disabled in the default unit-test phase; run explicitly with -Dtest=InventoryApplicationTests
 * when the database is available.
 */
@SpringBootTest
@Disabled("Integration test — requires live PostgreSQL. Run manually with docker-compose up -d first.")
class InventoryApplicationTests {

	@Test
	void contextLoads() {
	}

}
