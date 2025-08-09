import db from "../../../db";
import { advocates } from "../../../db/schema";
// import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  // static
  // const data = advocateData;

  const data = await db.select().from(advocates);
  return Response.json({ data });
}
