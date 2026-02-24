interface DpTextareaProps {
  placeholder: string
  minHeight?: number
  className?: string
}

export default function DpTextarea({ placeholder, minHeight = 60, className = '' }: DpTextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      style={{ minHeight }}
      className={`w-full border border-dashed border-petal-light rounded-lg p-3 font-dm text-[13px] text-ink-mid bg-warm-white resize-y outline-none focus:border-petal transition-colors placeholder:text-ink-faint ${className}`}
    />
  )
}
