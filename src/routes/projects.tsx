import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects - Zeyad Mohammed" },
      {
        name: "description",
        content: "Selected projects across frontend, backend, and full-stack product work.",
      },
    ],
  }),
  component: ProjectsLayout,
});

function ProjectsLayout() {
  return (
    <PageShell>
      <Outlet />
    </PageShell>
  );
}

export default ProjectsLayout;
