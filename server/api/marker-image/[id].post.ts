import { H3Error } from "h3";

export default defineEventHandler(async (event) => {
  const { files } = await readBody(event);

  const id = getRouterParam(event, "id");

  try {
    for (const file of files) {
      const fileName = `${id}-${Date.now()}`;
      await storeFileLocally(file, fileName);
    }
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error uploading files",
    });
  }
  // const fileName = `${id}-${Date.now()}-${file.filename}`;
  // const db = useDatabase("myDB");
});
