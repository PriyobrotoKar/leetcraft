import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/problems/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/problems/$id/"!</div>
}
