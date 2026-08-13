import type { Rakning, Syssla } from "../domain/types";
import { supabase } from "./supabase";

function kravPaKlient() {
  if (!supabase) throw new Error("Supabase är inte konfigurerat ännu.");
  return supabase;
}

export async function hamtaRakningar(hushallId: string): Promise<Rakning[]> {
  const klient = kravPaKlient();
  const { data, error } = await klient
    .from("bills")
    .select("id, household_id, category, supplier, amount, due_date, status, source")
    .eq("household_id", hushallId)
    .order("due_date");
  if (error) throw error;
  return (data ?? []).map((rad) => ({
    id: rad.id,
    hushallId: rad.household_id,
    vertikal: rad.category,
    leverantor: rad.supplier,
    belopp: Number(rad.amount),
    forfallodatum: rad.due_date,
    betald: rad.status === "paid",
    kalla: rad.source,
  }));
}

export async function hamtaSysslor(hushallId: string): Promise<Syssla[]> {
  const klient = kravPaKlient();
  const { data, error } = await klient
    .from("chores")
    .select("id, household_id, title, assignee_name, due_date, status, category, recurrence")
    .eq("household_id", hushallId)
    .order("due_date");
  if (error) throw error;
  return (data ?? []).map((rad) => ({
    id: rad.id,
    hushallId: rad.household_id,
    titel: rad.title,
    ansvarig: rad.assignee_name ?? "Ej tilldelad",
    forfallodatum: rad.due_date,
    klar: rad.status === "done",
    kategori: rad.category,
    aterkommer: rad.recurrence ?? undefined,
  }));
}
