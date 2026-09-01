"use client";

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
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
import { Columns3 } from "lucide-react";
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
import { Filter } from "lucide-react";
import {
  DOCUMENT_TYPE_OPTIONS,
  COLUMNS,
  ColumnKey,
} from "@/app/constants/column";
import {
  DocStatus,
  STATUS_OPTIONS,
  statusStyles,
} from "@/app/constants/status";
import { ColumnVisibilityDropdown } from "./column-visibility-dropdown";
import { FilterDropdown } from "./filter-dropdown";

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function SortIcon({
  column,
  sortBy,
  sortOrder,
}: {
  column: "tr_number" | "created_at";
  sortBy: string;
  sortOrder: "asc" | "desc";
}) {
  if (sortBy !== column) return <ArrowUpDown className="size-2.5 opacity-40" />;
  return sortOrder === "asc" ? (
    <ArrowUp className="size-2.5" />
  ) : (
    <ArrowDown className="size-2.5" />
  );
}

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
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  statuses,
  setStatuses,
  documentTypes,
  setDocumentTypes,
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
  sortBy: "tr_number" | "created_at";
  sortOrder: "asc" | "desc";
  setSortBy: (sortBy: "tr_number" | "created_at") => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  statuses: DocStatus[];
  setStatuses: (statuses: DocStatus[]) => void;
  documentTypes: string[];
  setDocumentTypes: (documentTypes: string[]) => void;
}) {
  const [localSearch, setLocalSearch] = useState(search);
  const [fontSize, setFontSize] = useState(14);
  const fontSizes = [14, 12, 10];
  const activeFilterCount = statuses.length + documentTypes.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  });

  // -----------------
  // * HIDE COLUMN
  // * ini state utk menyimpan kolom yg terlihat (bisa dihover di visibleColumns utk lebih jelasnya)

  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(
    COLUMNS.map((c) => c.key),
  );

  // * ini adalah logic utama dari fitur ini
  // * awalnya ngecek "apakah kolom ini sudah ada di visibleColumns?"
  // * kalo ada, sembunyikan kolomnya. dan sebaliknya
  function toggleColumn(key: ColumnKey) {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }
  // ? prev = data kolom sebelumnya(visibleColumns)
  // ? includes = mengecek ada atau tidak sebuah data
  // ? prev.includes(key) = ada data (key) gk di dalam prev?
  // ? filter(apa yg mau di-exclude)
  // -----------------

  return (
    <>
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
          <div className="flex items-center gap-4 text-muted-foreground">
            <FilterDropdown
              statuses={statuses}
              setStatuses={setStatuses}
              documentTypes={documentTypes}
              setDocumentTypes={setDocumentTypes}
              setPage={setPage}
            />

            <ColumnVisibilityDropdown
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
            />

            <div className="flex items-center">
              <p className="text-xs font-medium mr-3">Font size:</p>

              {fontSizes.map((size) => (
                <span
                  key={size}
                  onClick={() => setFontSize(size)}
                  style={{ fontSize: `${size}px` }}
                  className={`cursor-pointer px-2 py-1 ${
                    fontSize === size
                      ? "bg-stone-300 text-white rounded-sm"
                      : ""
                  }`}
                >
                  A
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table style={{ fontSize: `${fontSize}px` }}>
            <TableHeader>
              <TableRow>
                {visibleColumns.includes("tr_number") && (
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => {
                      if (sortBy === "tr_number") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("tr_number");
                        setSortOrder("asc");
                      }
                      setPage(1);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      TR
                      <SortIcon
                        column="tr_number"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                      />
                    </div>
                  </TableHead>
                )}

                {visibleColumns.includes("document_name") && (
                  <TableHead>Document Name</TableHead>
                )}
                {visibleColumns.includes("document_number") && (
                  <TableHead>Doc. Number</TableHead>
                )}
                {visibleColumns.includes("rev") && <TableHead>Rev</TableHead>}
                {visibleColumns.includes("status") && (
                  <TableHead>Status</TableHead>
                )}
                {visibleColumns.includes("return_date") && (
                  <TableHead>Return Date</TableHead>
                )}
                {visibleColumns.includes("created_at") && (
                  <TableHead
                    className="text-right cursor-pointer select-none"
                    onClick={() => {
                      if (sortBy === "created_at") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("created_at");
                        setSortOrder("asc");
                      }
                      setPage(1);
                    }}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Submitted
                      <SortIcon
                        column="created_at"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                      />
                    </div>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                documents?.data?.map((doc) => (
                  <TableRow key={doc.id}>
                    {visibleColumns.includes("tr_number") && (
                      <TableCell className="font-medium">
                        {doc.tr_number}
                      </TableCell>
                    )}
                    {visibleColumns.includes("document_name") && (
                      <TableCell>{doc.document_name}</TableCell>
                    )}
                    {visibleColumns.includes("document_number") && (
                      <TableCell>{doc.document_number}</TableCell>
                    )}
                    {visibleColumns.includes("rev") && (
                      <TableCell>{doc.rev}</TableCell>
                    )}
                    {visibleColumns.includes("status") && (
                      <TableCell>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            statusStyles[doc.status ?? ""] ??
                            "bg-gray-300 text-black"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.includes("return_date") && (
                      <TableCell>{doc.return_date ?? "-"}</TableCell>
                    )}
                    {visibleColumns.includes("created_at") && (
                      <TableCell className="text-right">
                        {doc.created_at
                          ? new Date(doc.created_at).toLocaleDateString("id-ID")
                          : "-"}
                      </TableCell>
                    )}
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
    </>
  );
}
