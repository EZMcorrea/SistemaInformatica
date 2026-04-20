import { prisma } from "@/lib/db";
import { SimpleForm } from "@/components/ui/simple-form";

export default async function ServicosPage() {
  const list = await prisma.technicalService.findMany({ include: { client: true, technician: true }, orderBy: { serviceDate: "desc" } });
  return <div className="space-y-3"><h1 className="text-2xl font-bold">Serviços/Atendimentos</h1>
    <SimpleForm endpoint="/api/services" label="Salvar atendimento" fields={["clientId","serviceType","description","technicianId","serviceDate","serviceTime","status","notes"]} />
    <div className="card overflow-auto"><table className="table"><thead><tr><th>Cliente</th><th>Tipo</th><th>Técnico</th><th>Status</th></tr></thead><tbody>{list.map(s=><tr key={s.id}><td>{s.client.corporateName}</td><td>{s.serviceType}</td><td>{s.technician.name}</td><td>{s.status}</td></tr>)}</tbody></table></div></div>;
}
