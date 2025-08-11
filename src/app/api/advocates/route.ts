import {db} from "../../../db";
import { advocates } from "../../../db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function GET(req: Request) {
    const p = new URL(req.url).searchParams;
    const search = p.get("q")?.trim() ?? "";
    const limit = Math.min(Number(p.get("limit") ?? 50), 100);
    const offset = Math.max(Number(p.get("offset") ?? 0), 0);


    const whereClause = search
        ? or(
            ilike(advocates.firstName, `%${search}%`),
            ilike(advocates.lastName, `%${search}%`),
            ilike(advocates.city, `%${search}%`),
            ilike(advocates.degree, `%${search}%`),
            sql`${advocates.specialties}::text ILIKE ${`%${search}%`}`,
            sql`CAST(${advocates.yearsOfExperience} AS TEXT) ILIKE ${`%${search}%`}`
        )
        : undefined;

    const [data, totalResult] = await Promise.all([
        db.query.advocates.findMany({
            where: whereClause,
            limit,
            offset,
        }),
        db
            .select({ count: sql<number>`count(*)` })
            .from(advocates)
            .where(whereClause ?? sql`true`),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);

    return Response.json({ data, limit, offset, total });
}

