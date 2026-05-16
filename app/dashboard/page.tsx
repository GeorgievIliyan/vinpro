import { DashboardClient } from './DashboardClient'

export default function DashboardPage() {
  const apiToken = process.env.SECURE_API_TOKEN ?? ''

  return <DashboardClient apiToken={apiToken} />
}