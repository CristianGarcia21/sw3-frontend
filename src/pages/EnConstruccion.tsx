export function EnConstruccion({ titulo, issue }: { titulo: string; issue?: string }) {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-900">{titulo}</h1>
      <p className="mt-2 text-slate-500">En construcción{issue ? ` (${issue})` : ''}.</p>
    </section>
  )
}
