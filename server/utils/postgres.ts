import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../database/schema";

declare global {
	var __orm: {
		db?: ReturnType<typeof drizzle>;
		client?: ReturnType<typeof postgres>;
	} | undefined;
}

export const tables = schema;

const dbInstance = globalThis.__orm ?? (globalThis.__orm = {});

function initDb() {
	const databaseUrl = process.env.NUXT_POSTGRES_URL;

	if (!databaseUrl) {
		throw createError("Missing database URL variable");
	}

	if (process.env.NODE_ENV === "development") {
		// eslint-disable-next-line no-console
		console.log("Bugmuggle Dev ====>", "Database URL", databaseUrl);
	}

	const client = postgres(databaseUrl, { max: 1 });

	if (!dbInstance.client) {
		dbInstance.client = postgres(databaseUrl, { max: 1 });
	}

	if (!dbInstance.db) {
		dbInstance.db = drizzle(client, { schema });
	}
}

export function useDb() {
	if (!dbInstance.db) {
		initDb();
	}

	return dbInstance.db;
}
