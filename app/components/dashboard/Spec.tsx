export default function Spec({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  if (!value) return null

  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium text-right">
        {value}
      </span>
    </div>
  )
}