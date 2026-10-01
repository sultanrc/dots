"use client";

import { ChevronsUpDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setActiveProject } from "@/action/action";

type Project = { id: string; name: string; code: string | null };

export function ProjectSwitcher({
  projects,
  activeProject,
}: {
  projects: Project[];
  activeProject: Project | null;
}) {
  const router = useRouter();

  async function handleSelect(projectId: string) {
    await setActiveProject(projectId);
    router.refresh(); // re-fetch data server component dengan proyek baru
  }

  if (!activeProject) {
    return (
      <div className="px-2 py-2 text-sm text-muted-foreground">
        No project assigned
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium hover:bg-accent">
          <span className="truncate">
            {activeProject.code ?? activeProject.name}
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => handleSelect(project.id)}
            className="flex items-center justify-between"
          >
            <span className="truncate">{project.code ?? project.name}</span>
            {project.id === activeProject.id && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
