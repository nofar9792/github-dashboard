import Dashboard from "@/app/dashboard";

export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  return <Dashboard username={params.username} />;
}
