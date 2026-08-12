import { Metadata } from "next";
import { SummaryCards } from "./_components/summary-cards";

export const metadata: Metadata = {
  title: "DOTS - Dashboard",
  description: "Your personal document management dashboard",
};

export default function DashboardPage() {
  return (
    <div className="px-6 py-4 space-y-4">
      <section id="header">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p>
          Get insights into your spending, track your expenses, and manage your
          finances.
        </p>
      </section>
      <section id="content">
        <SummaryCards />
      </section>
    </div>
  );
}
