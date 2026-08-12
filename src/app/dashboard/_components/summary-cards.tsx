import { getDataSummary } from "@/action/action";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
      title: "Need to Update",
      description: "Total number of documents that need updates",
      value: totalNeedUpdate,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
