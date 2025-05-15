import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/problems')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/problems"!</div>
}
