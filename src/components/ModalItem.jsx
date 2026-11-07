import { useEffect } from "react"


function rotulo(chave) {
  return chave
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
}

function vazio(v) {
  return v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0)
}

// "images/crops/starfruit/seed.png" -> true
function ehImagem(v) {
  return typeof v === "string" && /^images\/.+\.(png|jpe?g|gif|webp)$/i.test(v)
}

// "images/crops/starfruit/seed.png" -> "/stardew/crops/starfruit/seed.png"
function urlImagem(caminho) {
  return encodeURI(`/stardew/${caminho.replace(/^images\//, "")}`)
}

// Mostra qualquer tipo de valor
function Valor({ v }) {
  if (typeof v === "boolean") return <span>{v ? "Yes" : "No"}</span>

  // caminho de imagem vira imagem
  if (ehImagem(v)) {
    return (
      <img
        src={urlImagem(v)}
        alt=""
        className="object-contain w-12 h-12"
        style={{ imageRendering: "pixelated" }}
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    )
  }

  // lista de itens com nome + imagem (ex.: estágios de crescimento) vira uma fileira
  if (
    Array.isArray(v) &&
    v.length > 0 &&
    v.every((x) => x && typeof x === "object" && ehImagem(x.image))
  ) {
    return (
      <div className="flex flex-wrap gap-3">
        {v.map((x, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <img
              src={urlImagem(x.image)}
              alt=""
              className="object-contain w-12 h-12"
              style={{ imageRendering: "pixelated" }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="text-[10px] opacity-70">{x.name}</span>
          </div>
        ))}
      </div>
    )
  }

  // lista simples vira texto separado por vírgula; lista de objetos vira lista com marcadores
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x !== "object")) return <span>{v.join(", ")}</span>
    return (
      <ul className="pl-4 list-disc">
        {v.map((x, i) => (
          <li key={i}><Valor v={x} /></li>
        ))}
      </ul>
    )
  }

  // objeto: um campo por linha, recuado
  if (typeof v === "object") {
    return (
      <div className="pl-3 border-l-2 border-[#783F04]/30">
        {Object.entries(v)
          .filter(([, val]) => !vazio(val))
          .map(([k, val]) => (
            <div key={k}>
              <span className="opacity-70">{rotulo(k)}: </span>
              <Valor v={val} />
            </div>
          ))}
      </div>
    )
  }

  return <span>{String(v)}</span>
}

const ESCONDER = ["id", "name", "image", "description"]


function ModalItem({ item, cor = "#dbbf98", onFechar }) {
  // fecha com a tecla Esc
  useEffect(() => {
    if (!item) return

    function aoApertar(e) {
      if (e.key === "Escape") onFechar()
    }

    window.addEventListener("keydown", aoApertar)
    return () => window.removeEventListener("keydown", aoApertar)
  }, [item, onFechar])

  if (!item) return null

  const campos = Object.entries(item).filter(
    ([chave, valor]) => !ESCONDER.includes(chave) && !vazio(valor)
  )

  return (
    <div
      onClick={onFechar}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6 border-4 border-[#783F04] rounded-xl text-[#783F04] font-popozao break-words"
        style={{ backgroundColor: cor }}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {item.image && (
            <img
              src={urlImagem(item.image)}
              alt=""
              className="object-contain w-12 h-12 sm:w-16 sm:h-16 shrink-0"
              style={{ imageRendering: "pixelated" }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <h2 className="text-[18px] sm:text-[22px]">{item.name}</h2>
        </div>

        {item.description && <p className="mt-3 text-[13px]">{item.description}</p>}

        <dl className="mt-5 space-y-3 text-[13px]">
          {campos.map(([chave, valor]) => (
            <div key={chave}>
              <dt className="text-[11px] uppercase opacity-60">{rotulo(chave)}</dt>
              <dd><Valor v={valor} /></dd>
            </div>
          ))}
        </dl>

        <button
          onClick={onFechar}
          className="px-4 py-2 mt-6 text-[13px] border-2 border-[#783F04] rounded-lg hover:bg-[#783F04] hover:text-[#F3E3B3]"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default ModalItem