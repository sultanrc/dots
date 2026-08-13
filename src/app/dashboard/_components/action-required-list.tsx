import * as React from "react";

import { getActionRequiredDocuments } from "@/action/action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export async function ActionRequiredList() {
  const documents = await getActionRequiredDocuments();

  return (
    <div className="flex flex-col border">
      <h4 className="p-3 text-sm leading-none font-medium bg-gray-300">
        Documents Requiring Attention
      </h4>
      <ScrollArea className="h-96 w-full min-w-0">
        <div className="p-4">
          {documents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No documents requiring attention.
            </p>
          )}
          {documents.map((doc) => (
            <React.Fragment key={doc.id}>
              <div className="text-sm">
                {doc.document_name} — {doc.status}
              </div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
