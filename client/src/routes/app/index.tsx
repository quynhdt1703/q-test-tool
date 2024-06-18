import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/')({
  component: AppLayout,
});

function AppLayout() {
  return <Navigate to="/app/projects" />;
}
