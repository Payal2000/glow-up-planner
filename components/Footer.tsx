export default function Footer() {
  return (
    <footer
      className="text-center px-4 sm:px-6 py-[60px]"
      style={{ background: 'linear-gradient(180deg, #fefaf8, #f9e4eb)' }}
    >
      <p
        className="font-playfair italic text-ink-dark max-w-[600px] mx-auto mb-4"
        style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}
      >
        &ldquo;She believed she could, so she did.&rdquo;
      </p>
      <p className="text-[12px] text-ink-faint tracking-[2px] uppercase">
        💕 Start your glow-up today
      </p>
    </footer>
  )
}
