import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/action/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="ghost" size="sm">
        <LogOut className="size-4 mr-1" />
        Logout
      </Button>
    </form>
  );
}
