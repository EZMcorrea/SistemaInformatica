"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  ["/dashboard", "Dashboard"],
  ["/clientes", "Clientes"],
  ["/roteadores", "Roteadores"],
  ["/cameras", "Câmeras/CFTV"],
  ["/servicos", "Serviços"],
  ["/busca", "Busca Global"],
  ["/exportacao", "Exportação PDF"],
  ["/usuarios", "Usuários"],
  ["/logs", "Logs"]
];

export function Shell({ children, user }: { children: React.ReactNode; user: { name: string; role: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <aside className="bg-slate-900 text-white p-4">
        <h1 className="text-lg font-bold">TechInfo Manager</h1>
        <nav className="mt-6 space-y-1">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={`block rounded px-3 py-2 text-sm ${pathname === href ? "bg-brand-500" : "hover:bg-slate-800"}`}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main>
        <header className="flex items-center justify-between border-b bg-white px-6 py-3">
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-slate-500">Perfil: {user.role}</p>
          </div>
          <button className="btn-secondary" onClick={logout}>Sair</button>
        </header>
        <section className="p-6">{children}</section>
      </main>
    </div>
  );
}
