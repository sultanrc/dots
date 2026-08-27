"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDataSummary() {
  const supabase = await createClient();

  const [
    { count: totalTransmittal },
    { count: totalApproved },
    { count: totalOutstanding },
    { count: totalNeedUpdate },
  ] = await Promise.all([
    supabase.from("transmittal").select("*", { count: "exact", head: true }),

    supabase
      .from("document")
      .select("*", { count: "exact", head: true })
      .in("status", ["APPROVED", "APPROVED_WITH_COMMENT"]),

    supabase
      .from("document")
      .select("*", { count: "exact", head: true })
      .eq("status", "WAITING_FOR_APPROVAL"),

    supabase
      .from("document")
      .select("*", { count: "exact", head: true })
      .eq("status", "NOT_APPROVED"),
  ]);

  return {
    totalTransmittal: totalTransmittal ?? 0,
    totalApproved: totalApproved ?? 0,
    totalOutstanding: totalOutstanding ?? 0,
    totalNeedUpdate: totalNeedUpdate ?? 0,
  };
}

export async function getActionRequiredDocuments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("document")
    .select("id, document_name, document_number, rev, status, created_at")
    .neq("status", "APPROVED")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getSubmissions(params?: {
  limit?: number;
  page?: number;
  search?: string;
}) {
  const { limit = 10, page = 1, search } = params || {};
  const supabase = await createClient();

  let query = supabase
    .from("document")
    .select(
      "id, document_name, document_number, rev, status, return_date, created_at, transmittal:transmittal_id(tr_number)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `document_name.ilike.%${search}%,document_number.ilike.%${search}%`,
    );
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) throw new Error(error.message);

  const totalData = count || 0;

  return {
    data,
    totalData,
    totalPages: Math.ceil(totalData / limit),
  };
}
