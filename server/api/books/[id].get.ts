import { applyApiDelay } from "../../utils/api-delay";
import { getBookById } from "../../utils/book-queries";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid book ID" });
  }

  await applyApiDelay(getQuery(event));

  try {
    return await getBookById(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Can't load book";
    if (message === "Book not found" || message === "Invalid book ID") {
      throw createError({ statusCode: 404, statusMessage: message });
    }
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
