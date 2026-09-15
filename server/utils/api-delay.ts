import {
  getApiDelayMs,
  MAX_API_DELAY_MS,
  parseSearchParams,
} from "../../shared/url-state";
import { delay } from "../../shared/utils";

export async function applyApiDelay(query: Record<string, unknown>) {
  const params = parseSearchParams(
    query as Record<string, string | string[] | undefined>,
  );
  const config = useRuntimeConfig();
  const uiMs = getApiDelayMs(params);
  const envMs = Number(config.apiDelayMs || process.env.API_DELAY_MS || 0);
  const ms = uiMs > 0 ? uiMs : Number.isFinite(envMs) ? Math.min(MAX_API_DELAY_MS, Math.max(0, envMs)) : 0;
  if (ms > 0) await delay(ms);
  return params;
}
