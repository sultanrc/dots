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
    .select("id, document_name, document_number, status, created_at")
    .neq("status", "APPROVED")
    .order("created_at", { ascending: false }); // paling muda (baru) di atas

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
