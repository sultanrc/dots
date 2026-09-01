"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { DOCUMENT_TYPE_OPTIONS } from "@/app/constants/column";
import { DocStatus, STATUS_OPTIONS } from "@/app/constants/status";

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function FilterDropdown({
  statuses,
  setStatuses,
  documentTypes,
  setDocumentTypes,
  setPage,
}: {
  statuses: DocStatus[];
  setStatuses: (statuses: DocStatus[]) => void;
  documentTypes: string[];
  setDocumentTypes: (documentTypes: string[]) => void;
  setPage: (page: number) => void;
}) {
  const activeFilterCount = statuses.length + documentTypes.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="font-normal">
          <Filter className="size-4 mr-1" />
          Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 max-h-80 overflow-y-auto"
      >
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        {STATUS_OPTIONS.map((s) => (
          <DropdownMenuCheckboxItem
            key={s}
            checked={statuses.includes(s)}
            onCheckedChange={() => {
              setStatuses(toggleInArray(statuses, s));
              setPage(1);
            }}
          >
            {s}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Document Type</DropdownMenuLabel>
        {DOCUMENT_TYPE_OPTIONS.map((t) => (
          <DropdownMenuCheckboxItem
            key={t}
            checked={documentTypes.includes(t)}
            onCheckedChange={() => {
              setDocumentTypes(toggleInArray(documentTypes, t));
              setPage(1);
            }}
          >
            {t}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
