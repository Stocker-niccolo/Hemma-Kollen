import type { Rakning, Syssla } from "../domain/types";
import { supabase } from "./supabase";

function kravPaKlient() {
  if (!supabase) throw new Error("Supabase är inte konfigurerat ännu.");
  return supabase;
}

function tillRakning(rad: Record<string, unknown>): Rakning {
  return {
    id: String(rad.id),
    hushallId: String(rad.household_id),
    vertikal: rad.category as Rakning["vertikal"],
    leverantor: String(rad.supplier),
    belopp: Number(rad.amount),
    forfallodatum: String(rad.due_date),
    betald: rad.status === "paid",
    kalla: rad.source as Rakning["kalla"],
  };
}

function tillSyssla(rad: Record<string, unknown>): Syssla {
  return {
    id: String(rad.id),
    hushallId: String(rad.household_id),
    titel: String(rad.title),
    ansvarig: rad.assignee_name ? String(rad.assignee_name) : "Ej tilldelad",
    forfallodatum: String(rad.due_date),
    klar: rad.status === "done",
    kategori: rad.category as Syssla["kategori"],
    aterkommer: (rad.recurrence as Syssla["aterkommer"] | null) ?? undefined,
  };
}

export async function hamtaEllerSkapaHushall(anvandarId: string) {
  const klient = kravPaKlient();
  const { data: medlemskap, error: medlemsfel } = await klient
    .from("household_members")
    .select("household_id")
    .eq("user_id", anvandarId)
    .limit(1)
    .maybeSingle();
  if (medlemsfel) throw medlemsfel;

  if (medlemskap) {
    const { data: hushall, error: hushallsfel } = await klient
      .from("households")
      .select("id, name")
      .eq("id", medlemskap.household_id)
      .single();
    if (hushallsfel) throw hushallsfel;
    return { id: String(hushall.id), namn: String(hushall.name) };
  }

  const { data: nyttHushall, error: skaparFel } = await klient
    .from("households")
    .insert({ name: "Mitt hushåll", created_by: anvandarId })
    .select("id, name")
    .single();
  if (skaparFel) throw skaparFel;
  return { id: String(nyttHushall.id), namn: String(nyttHushall.name) };
}

export async function hamtaRakningar(hushallId: string): Promise<Rakning[]> {
  const klient = kravPaKlient();
  const { data, error } = await klient
    .from("bills")
    .select("id, household_id, category, supplier, amount, due_date, status, source")
    .eq("household_id", hushallId)
    .order("due_date");
  if (error) throw error;
  return (data ?? []).map(tillRakning);
}

export async function skapaRakning(
  hushallId: string,
  rakning: Omit<Rakning, "id" | "hushallId" | "betald">,
) {
  const klient = kravPaKlient();
  const { data, error } = await klient
    .from("bills")
    .insert({
      household_id: hushallId,
      supplier: rakning.leverantor,
      category: rakning.vertikal,
      amount: rakning.belopp,
      due_date: rakning.forfallodatum,
      source: rakning.kalla,
      status: "upcoming",
    })
    .select("id, household_id, category, supplier, amount, due_date, status, source")
    .single();
  if (error) throw error;
  return tillRakning(data);
}

export async function sattRakningBetald(id: string, betald: boolean) {
  const klient = kravPaKlient();
  const { error } = await klient
    .from("bills")
    .update({
      status: betald ? "paid" : "upcoming",
      paid_at: betald ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function hamtaSysslor(hushallId: string): Promise<Syssla[]> {
  const klient = kravPaKlient();
  const { data, error } = await klient
    .from("chores")
    .select("id, household_id, title, assignee_name, due_date, status, category, recurrence")
    .eq("household_id", hushallId)
    .order("due_date");
  if (error) throw error;
  return (data ?? []).map(tillSyssla);
}

export async function skapaSyssla(
  hushallId: string,
  syssla: Omit<Syssla, "id" | "hushallId" | "klar">,
) {
  const klient = kravPaKlient();
  const { data, error } = await klient
    .from("chores")
    .insert({
      household_id: hushallId,
      title: syssla.titel,
      assignee_name: syssla.ansvarig,
      due_date: syssla.forfallodatum,
      category: syssla.kategori,
      recurrence: syssla.aterkommer ?? null,
      status: "open",
    })
    .select("id, household_id, title, assignee_name, due_date, status, category, recurrence")
    .single();
  if (error) throw error;
  return tillSyssla(data);
}

export async function sattSysslaKlar(id: string, klar: boolean) {
  const klient = kravPaKlient();
  const { error } = await klient
    .from("chores")
    .update({
      status: klar ? "done" : "open",
      completed_at: klar ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw error;
}
