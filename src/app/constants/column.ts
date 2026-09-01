export const DOCUMENT_TYPE_OPTIONS = [
  "CIVIL DRAWING",
  "MECHANICAL DRAWING",
  "ELECTRICAL DRAWING",
  "INSTRUMENT DRAWING",
  "DATA SHEET",
  "PROSEDUR",
  "BERITA ACARA",
  "NOTULENSI",
  "PROGRESS",
  "LIFTING PLAN",
  "TECHNICAL QUERY",
  "EDL",
  "LAINNYA",
];

// -----------------
// * HIDE COLUMN
// * mendeklarasikan ada kolom apa saja, lalu didefinisikan menjadi:
// * label = utk tampilan kolom
// * key = utk backend/logi

export const COLUMNS = [
  { key: "tr_number", label: "TR" },
  { key: "document_name", label: "Document Name" },
  { key: "document_number", label: "Doc. Number" },
  { key: "rev", label: "Rev" },
  { key: "status", label: "Status" },
  { key: "return_date", label: "Return Date" },
  { key: "created_at", label: "Submitted" },
] as const;

export type ColumnKey = (typeof COLUMNS)[number]["key"];

// * ini type utk aturan typescript
// -----------------
