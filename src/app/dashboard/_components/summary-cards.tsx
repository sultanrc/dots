import { getDataSummary } from "@/action/action";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export async function SummaryCards() {
  const { totalTransmittal, totalApproved, totalOutstanding, totalNeedUpdate } =
    await getDataSummary();

  const cards = [
    {
      title: "Submitted Transmittal",
      description: "Total number of transmittals in the system",
      value: totalTransmittal,
    },
    {
      title: "Approved Documents",
      description: "Total number of approved documents",
      value: totalApproved,
    },
    {
      title: "Outstanding Documents",
      description: "Total number of documents waiting for approval",
      value: totalOutstanding,
    },
    {
      title: "Need to Updated Documents",
      description: "Total number of documents that need updates",
      value: totalNeedUpdate,
    },
  ];

  return (
    <div className="flex gap-4 max-w-full">
      {cards.map((card) => (
        <Card key={card.title} className="flex-1">
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
