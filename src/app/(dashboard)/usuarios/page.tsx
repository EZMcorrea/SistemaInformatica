import { prisma } from "@/lib/db";
import { SimpleForm } from "@/components/ui/simple-form";

export default async function UsuariosPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return <div className="space-y-3"><h1 className="text-2xl font-bold">Gestão de Usuários</h1>
    <SimpleForm endpoint="/api/users" label="Salvar usuário" fields={["name","email","password","role"]} />
    <div className="card"><table className="table"><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>)}</tbody></table></div></div>;
}
