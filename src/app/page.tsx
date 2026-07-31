import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const cards = [
  {
    href: "/dashboard",
    title: "Main Dashboard →",
    description: "Access and manage your main dashboard here.",
    highlight: false,
  },
  {
    href: "https://nextjs.org/learn",
    title: "Outstanding Documents →",
    description: "View and manage your outstanding documents with ease.",
    highlight: true,
  },
  {
    href: "https://vercel.com/templates?framework=next.js",
    title: "EDL →",
    description: "Access and manage your engineering deliverables effectively.",
    highlight: true,
  },
  {
    href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
    title: "About →",
    description: "Learn more about Document Outstanding Tracking System",
    highlight: true,
  },
];

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-5xl font-bold">
            Welcome to{" "}
            <a className="text-blue-600" href="https://nextjs.org">
              DOTS
            </a>
          </h1>

          <p className="mt-3 text-xl">
            Track our documents with Document Outstanding Tracking System{" "}
          </p>

          <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full gap-4">
            {cards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="w-96 mt-6 hover:text-blue-600 focus:text-blue-600"
              >
                <Card className={card.highlight ? "bg-gray-100" : ""}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-xl">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
