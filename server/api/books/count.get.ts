import {
  toBookFilters,
  toBookQuery,
} from "../../../shared/features/book/book-utils";
import { applyApiDelay } from "../../utils/api-delay";
import { getBooksCount } from "../../utils/book-queries";

export default defineEventHandler(async (event) => {
  const params = await applyApiDelay(getQuery(event));
  return getBooksCount(toBookFilters(toBookQuery(params)));
});
