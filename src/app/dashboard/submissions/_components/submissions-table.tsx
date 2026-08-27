"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSubmissions } from "@/action/action";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";

const statusStyles: Record<string, string> = {
  WAITING_FOR_APPROVAL: "bg-yellow-400 text-black",
  CANCELLED: "bg-neutral-700 text-white",
  NOT_APPROVED: "bg-red-600 text-white",
  APPROVED_WITH_COMMENT: "bg-orange-400 text-black",
  APPROVED: "bg-green-600 text-white",
};

export default function SubmissionsTable({
  documents,
  isLoading,
  refetch,
  page,
  limit,
  search,
  setPage,
  setLimit,
  setSearch,
}: {
  documents?: Awaited<ReturnType<typeof getSubmissions>>;
  page: number;
  limit: number;
  search: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  isLoading: boolean;
  refetch: () => void;
}) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  });

  return (
    <Fragment>
      <Card className="w-full gap-2">
        <CardHeader className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
          <div>
            <Input
              placeholder="Search..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full"
            />
          </div>
        </CardHeader>
        <CardContent>
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
              {!isLoading &&
                documents?.data?.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      {doc.transmittal?.tr_number}
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
            {isLoading && (
              <TableCaption className="mb-4">Loading...</TableCaption>
            )}
            {!isLoading && documents?.data?.length === 0 && (
              <TableCaption className="mb-4">No documents found</TableCaption>
            )}
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Rows per page</div>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={`limit-${size}`} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {documents?.totalPages && documents?.totalPages > 1 ? (
              <Pagination className="w-auto mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        page === 1
                          ? setPage(Number(documents?.totalPages))
                          : setPage(page - 1)
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        page === Number(documents?.totalPages)
                          ? setPage(1)
                          : setPage(page + 1)
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : (
              ""
            )}
          </div>
        </CardContent>
      </Card>
    </Fragment>
  );
}
