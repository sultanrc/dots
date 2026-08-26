import { getSubmissionHistory } from "@/action/action";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusStyles: Record<string, string> = {
  WAITING_FOR_APPROVAL: "bg-yellow-400 text-black",
  CANCELLED: "bg-neutral-700 text-white",
  NOT_APPROVED: "bg-red-600 text-white",
  APPROVED_WITH_COMMENT: "bg-orange-400 text-black",
  APPROVED: "bg-green-600 text-white",
};

export default async function SubmissionHistoryTable() {
  const { data: documents } = await getSubmissionHistory();
  return (
    <>
      <Table>
        <TableCaption>A list of all submitted documents.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>TR</TableHead>
            <TableHead>Document Name</TableHead>
            <TableHead>Doc. Number</TableHead>
            <TableHead>Rev</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead className="text-right">Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                {doc.transmittal?.[0]?.tr_number}
              </TableCell>
              <TableCell>{doc.document_name}</TableCell>
              <TableCell>{doc.document_number}</TableCell>
              <TableCell>{doc.rev}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    statusStyles[doc.status] ?? "bg-gray-300 text-black"
                  }`}
                >
                  {doc.status}
                </span>
              </TableCell>
              <TableCell>{doc.return_date ?? "-"}</TableCell>
              <TableCell className="text-right">
                {new Date(doc.created_at).toLocaleDateString("id-ID")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
