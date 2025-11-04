export default defineEventHandler(async (event) => {
  if (event.node.req.method === "GET") {
    const db = useDatabase("myDB");

    const markers = await db.sql`SELECT * FROM marker`;

    return markers.rows;
  }

  if (event.node.req.method === "POST") {
    try {
      const userData = await readBody(event);

      const db = useDatabase("myDB");

      await db.sql`CREATE TABLE IF NOT EXISTS marker
    (
      id TEXT UNIQUE,
      lat INT,
      lng INT,
      type TEXT,
      color TEXT,
      name TEXT
      )
      `;

      const result = await db.sql`INSERT INTO marker
      (id,lat,lng,type,color,name)
      VALUES
      (${userData.id},${userData.lat},${userData.lng},${userData.type},${userData.color},${userData.name})`;

      return { result };
    } catch (err) {
      return err;
    }
  }

  if (event.node.req.method === "DELETE") {
    const userData = await readBody(event);
    const db = useDatabase("myDB");

    const deletedMarker =
      await db.sql`DELETE FROM marker WHERE id = ${userData.id}`;

    return deletedMarker;
  }
});
