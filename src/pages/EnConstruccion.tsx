export function EnConstruccion({ titulo, issue }: { titulo: string; issue?: string }) {
  return (
    <section>
      <h1 className="text-[34px] leading-tight font-bold tracking-[-0.028em]">{titulo}</h1>
      <p className="mt-1 text-texto-suave">En construcción{issue ? ` (${issue})` : ''}.</p>
    </section>
  )
}
