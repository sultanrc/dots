import * as React from "react";
import { getActionRequiredDocuments } from "@/action/action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const statusStyles: Record<string, string> = {
  WAITING_FOR_APPROVAL: "bg-yellow-400 text-black",
  CANCELLED: "bg-neutral-700 text-white",
  NOT_APPROVED: "bg-red-600 text-white",
  APPROVED_WITH_COMMENT: "bg-orange-400 text-black",
};

export async function ActionRequiredList() {
  const documents = await getActionRequiredDocuments();

  return (
    <div className="flex flex-col border">
      <h4 className="p-3 text-sm leading-none font-medium bg-gray-300">
        Documents Requiring Attention
      </h4>
      <ScrollArea className="h-96 w-full min-w-0">
        <div className="py-4">
          {documents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No documents requiring attention.
            </p>
          )}
          {documents.map((doc) => (
            <React.Fragment key={doc.id}>
              <div className="px-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium">{doc.document_name} </span>
                    <span className="text-xs text-muted-foreground">
                      {doc.document_number} · Rev {doc.rev}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      statusStyles[doc.status] ?? "bg-gray-300 text-black"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
