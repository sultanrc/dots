export type DocStatus =
  | "APPROVED"
  | "APPROVED_WITH_COMMENT"
  | "NOT_APPROVED"
  | "WAITING_FOR_APPROVAL"
  | "CANCELLED"
  | "RECALLED";

export const STATUS_OPTIONS: DocStatus[] = [
  "WAITING_FOR_APPROVAL",
  "APPROVED",
  "APPROVED_WITH_COMMENT",
  "NOT_APPROVED",
  "CANCELLED",
  "RECALLED",
];

export const statusStyles: Record<string, string> = {
  WAITING_FOR_APPROVAL: "bg-yellow-400 text-black",
  CANCELLED: "bg-neutral-700 text-white",
  NOT_APPROVED: "bg-red-600 text-white",
  APPROVED_WITH_COMMENT: "bg-orange-400 text-black",
  APPROVED: "bg-green-600 text-white",
};
