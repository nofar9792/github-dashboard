import Dashboard from "@/app/dashboard";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <Dashboard username={username} />;
}
