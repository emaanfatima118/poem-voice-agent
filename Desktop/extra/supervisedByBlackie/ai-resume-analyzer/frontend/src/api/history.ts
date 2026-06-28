import { api } from "./client";
import type { QueryHistory } from "../types";

export async function getHistory(): Promise<QueryHistory[]> {
  return api<QueryHistory[]>("/history/");
}

export async function createHistory(data: {
  query: string;
  response: string;
}): Promise<{ id: string }> {
  return api("/history/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
