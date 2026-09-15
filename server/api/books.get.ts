import { toBookQuery } from "../../shared/features/book/book-utils";
import { applyApiDelay } from "../utils/api-delay";
import { getBooksPage } from "../utils/book-queries";

export default defineEventHandler(async (event) => {
  const params = await applyApiDelay(getQuery(event));
  return getBooksPage(toBookQuery(params));
});
