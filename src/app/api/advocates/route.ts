import {db} from "../../../db";
import { advocates } from "../../../db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function GET(req: Request) {
    const search = new URL(req.url).searchParams.get('q')?.trim() ?? '';
    const data = await db.query.advocates.findMany({
        where: search
            ? or(
                ilike(advocates.firstName, `%${search}%`),
                ilike(advocates.lastName, `%${search}%`),
                ilike(advocates.city, `%${search}%`),
                ilike(advocates.degree, `%${search}%`),
                sql`${advocates.specialties}::text ILIKE ${`%${search}%`}`,
                sql`CAST(${advocates.yearsOfExperience} AS TEXT) ILIKE ${`%${search}%`}`
            )
            : undefined,
    });
    return Response.json({ data });
}

