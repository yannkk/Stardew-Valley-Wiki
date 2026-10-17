function Card({ icon, label, count, color }) {
  return (
    <button
      className={`relative aspect-square rounded-xl border-2 border-black/30 shadow-[-4px_4px_0px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:brightness-110 hover:-translate-y-1 transition ${color}`}
    >
      <span className="absolute top-2 right-3 text-white text-xs font-popozao">
        {count}
      </span>
      <span className="text-4xl">{icon}</span>
      <span className="text-white text-xs font-popozao">{label}</span>
    </button>
  )
}

export default Card