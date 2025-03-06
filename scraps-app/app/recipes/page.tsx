// app/recipes/page.tsx

import { sql } from "drizzle-orm";
import { db } from "@/db";

export default async function Page() {
  const result = await db.execute(sql`SELECT current_database()`)
  console.log(result)
  return (
    <div>

      <h1>Recipes</h1>
     
      
      {JSON.stringify(result)}

    </div>
  );
}