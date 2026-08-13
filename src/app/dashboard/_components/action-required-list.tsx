import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

export function ActionRequiredList() {
  return (
    <div className="flex flex-col border">
      <h4 className="p-3 text-sm leading-none font-medium bg-gray-300">
        Documents Requiring Attention
      </h4>
      <ScrollArea className="h-72 w-full min-w-0">
        <div className="p-4">
          {tags.map((tag) => (
            <React.Fragment key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
