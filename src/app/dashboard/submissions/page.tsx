import { Button } from "@/components/ui/button";
import SubmissionsPage from "./_components/submissions";
import { Printer } from "lucide-react";
import { Plus } from "lucide-react";
import { InsertButton } from "./_components/insert-dialog";

export default async function Submissions() {
  return (
    <div className="px-6 py-4 space-y-4">
      <div className="flex justify-between">
        <section id="header">
          <h1 className="text-4xl font-bold">Submissions</h1>
          <p className="text-muted-foreground text-sm">
            All documents that have ever been submitted, regardless of status.
          </p>
        </section>
        <section id="header-actions" className="flex w-36 items-end gap-2">
          <InsertButton />
          <Button variant="outline">
            <Printer />
          </Button>
        </section>
      </div>
      <section id="submission-history-table">
        <SubmissionsPage />
      </section>
    </div>
  );
}
