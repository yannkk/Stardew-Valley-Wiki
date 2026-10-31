import { Link } from "react-router-dom"

function Card({ icon, label, count, color, slug }) {
  return (
    <Link
      to={`/${slug}`}
      className={`relative aspect-square rounded-xl border-2 border-black/30 shadow-[-4px_4px_0px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center gap-1 p-2 sm:gap-2 cursor-pointer hover:brightness-110 hover:-translate-y-1 transition ${color}`}
    >
      <span className="absolute top-1.5 right-2 text-white text-[10px] sm:top-2 sm:right-3 sm:text-xs font-popozao">
        {count}
      </span>

      <img
        src={icon}
        alt={label}
        className="object-contain w-8 h-8 sm:w-10 sm:h-10"
        style={{ imageRendering: "pixelated" }}
      />

      <span className="text-white text-[10px] leading-tight text-center sm:text-xs font-popozao">
        {label}
      </span>
    </Link>
  )
}

export default Card