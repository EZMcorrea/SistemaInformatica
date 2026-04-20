import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const [clients, routers, cameras, services, lastClients, lastServices] = await Promise.all([
    prisma.client.count(), prisma.routerConfig.count(), prisma.cameraConfig.count(), prisma.technicalService.count(),
    prisma.client.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.technicalService.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { client: true, technician: true } })
  ]);
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Dashboard</h1>
    <div className="grid md:grid-cols-4 gap-3">{[["Clientes",clients],["Roteadores",routers],["Câmeras",cameras],["Serviços",services]].map(([k,v])=><div className="card" key={String(k)}><p className="text-sm">{k}</p><p className="text-3xl font-bold">{String(v)}</p></div>)}</div>
    <div className="grid md:grid-cols-2 gap-3"><div className="card"><h2 className="font-semibold mb-2">Últimos clientes</h2>{lastClients.map(c=><p key={c.id}>{c.corporateName}</p>)}</div><div className="card"><h2 className="font-semibold mb-2">Últimos serviços</h2>{lastServices.map(s=><p key={s.id}>{s.serviceType} - {s.client.corporateName}</p>)}</div></div>
  </div>;
}
