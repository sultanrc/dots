"use client";

import { useState } from "react";
import SubmissionsTable from "./submissions-table";
import { useQuery } from "@tanstack/react-query";
import { getSubmissions } from "@/action/action";

export default function SubmissionsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["documents", page, limit, search],
    queryFn: () => getSubmissions({ page, limit, search }),
  });
  return (
    <>
      <SubmissionsTable
        documents={data}
        isLoading={isLoading}
        refetch={refetch}
        page={page}
        limit={limit}
        search={search}
        setPage={setPage}
        setLimit={setLimit}
        setSearch={setSearch}
      />
    </>
  );
}
