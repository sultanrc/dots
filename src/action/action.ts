"use server";

import { createClient } from "@/lib/supabase/server";
import { DocStatus } from "@/app/constants/status";
import { cookies } from "next/headers";

export async function getUserProjects() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("user_project")
    .select("project:project_id(id, name, code)")
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  // data berbentuk [{ project: {...} }], kita rapikan jadi array project langsung
  return data.map((row) => row.project).filter(Boolean);
}
export async function getActiveProject() {
  const projects = await getUserProjects();
  if (projects.length === 0) return null;

  const cookieStore = await cookies();
  const activeProjectId = cookieStore.get("active_project_id")?.value;

  const found = projects.find((p) => p.id === activeProjectId);

  // kalau cookie kosong / nunjuk ke proyek yang user nggak punya akses, fallback ke yang pertama
  return found ?? projects[0];
}
export async function setActiveProject(projectId: string) {
  const cookieStore = await cookies();
  cookieStore.set("active_project_id", projectId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 tahun
  });
}
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
  sortBy?: "tr_number" | "created_at";
  sortOrder?: "asc" | "desc";
  statuses?: DocStatus[];
  documentTypes?: string[];
}) {
  const {
    limit = 10,
    page = 1,
    search,
    sortBy = "created_at",
    sortOrder = "desc",
    statuses = [],
    documentTypes = [],
  } = params || {};

  const supabase = await createClient();

  let query = supabase.from("submissions").select("*", { count: "exact" });

  if (sortBy === "tr_number") {
    query = query.order("tr_number", {
      ascending: sortOrder === "asc",
    });
  } else {
    query = query.order("created_at", { ascending: sortOrder === "asc" });
  }

  if (search) {
    query = query.or(
      `document_name.ilike.%${search}%,document_number.ilike.%${search}%`,
    );
  }

  if (statuses.length > 0) {
    query = query.in("status", statuses);
  }

  if (documentTypes.length > 0) {
    query = query.in("document_type", documentTypes);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query.range(from, to);

  // uncommand kode di bawah ini utk lihat data yg difetch
  // console.log(JSON.stringify(data?.[0], null, 2));

  if (error) throw new Error(error.message);

  const totalData = count || 0;

  return {
    data,
    totalData,
    totalPages: Math.ceil(totalData / limit),
  };
}
export async function getDocumentTypes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document_type")
    .select("id, name")
    .order("name");

  if (error) throw new Error(error.message);

  return data;
}
export async function createSubmission(payload: {
  trNumber: string;
  submitDate: string;
  documents: {
    documentName: string;
    documentNumber: string | null;
    documentTypeId: string;
    rev: number;
  }[];
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil proyek yang sedang aktif
  const activeProject = await getActiveProject();
  if (!activeProject) {
    throw new Error("No active project selected");
  }

  // 1. Insert transmittal, sertakan project_id dan created_by
  const { data: transmittal, error: transmittalError } = await supabase
    .from("transmittal")
    .insert({
      tr_number: payload.trNumber,
      submit_date: payload.submitDate,
      created_by: user?.id ?? null,
      project_id: activeProject.id,
    })
    .select("id")
    .single();

  if (transmittalError) throw new Error(transmittalError.message);

  // 2. Insert dokumen (tidak berubah, document tidak punya project_id langsung)
  const documentsToInsert = payload.documents.map((doc) => ({
    transmittal_id: transmittal.id,
    document_name: doc.documentName,
    document_number: doc.documentNumber,
    document_type_id: doc.documentTypeId,
    rev: doc.rev,
    status: "WAITING_FOR_APPROVAL" as const,
    created_by: user?.id ?? null,
  }));

  const { error: documentsError } = await supabase
    .from("document")
    .insert(documentsToInsert);

  if (documentsError) throw new Error(documentsError.message);

  return { success: true };
}
export async function deleteDocument(documentId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("document")
    .delete()
    .eq("id", documentId);

  if (error) throw new Error(error.message);

  return { success: true };
}
export async function updateDocument(
  documentId: string,
  data: {
    documentName: string;
    documentNumber: string | null;
    documentTypeId: string;
    rev: number;
    status: DocStatus;
    returnDate: string | null;
  },
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("document")
    .update({
      document_name: data.documentName,
      document_number: data.documentNumber,
      document_type_id: data.documentTypeId,
      rev: data.rev,
      status: data.status,
      return_date: data.returnDate,
      updated_by: user?.id ?? null,
    })
    .eq("id", documentId);

  if (error) throw new Error(error.message);

  return { success: true };
}
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    email: user?.email ?? "",
    name: user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "User",
  };
}
