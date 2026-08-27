import { Metadata } from "next";
import { SummaryCards } from "./_components/summary-cards";
import { ActionRequiredList } from "./_components/action-required-list";

export const metadata: Metadata = {
  title: "DOTS - Dashboard",
  description: "Your personal document management dashboard",
};

export default function DashboardPage() {
  return (
    <div className="px-6 py-4 space-y-4">
      <section id="header">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Get insights into your spending, track your expenses, and manage your
          finances.
        </p>
      </section>
      <div className="flex flex-col gap-12">
        <section id="summary-cards">
          <SummaryCards />
        </section>
        <section id="action-required-list">
          <ActionRequiredList />
        </section>
      </div>
    </div>
  );
}
