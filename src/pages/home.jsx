import { useState, useEffect } from "react"
import { search, crops, fish, villagers, minerals, locations, achievements } from "stardew-valley-data"

import Card from "../components/Card"
import fundo from "../assets/fundo.png"
import logo from "../assets/logo.png"
import lupa from "../assets/lupa.png"
import pergaminho from "../assets/pergaminho.png"

const categorias = [
  { icon: "/stardew/crops/carrot/crop.png", label: "Crops", count: crops().count(), color: "bg-[#3F4A2B]" },
  { icon: "/stardew/fish/Sturgeon.png", label: "Fish", count: fish().count(), color: "bg-[#3B5A73]" },
  { icon: "/stardew/villagers/Abigail.png", label: "Villagers", count: villagers().count(), color: "bg-[#5B3F7A]" },
  { icon: "/stardew/minerals/foraged-minerals/Quartz.png", label: "Minerals", count: minerals().count(), color: "bg-[#6B3A1F]" },
  { icon: "/stardew/maps/icons/Standard Farm Map Icon.png", label: "Locations", count: locations().count(), color: "bg-[#2F6F6A]" },
  { icon: "/stardew/achievements/Achievement_Star_09.png", label: "Progress", count: achievements().count(), color: "bg-[#A07A10]" },
]

// "images/crops/parsnip/crop.png" -> "/stardew/crops/parsnip/crop.png"
function urlImagem(item) {
  if (!item.image) return null
  return encodeURI(`/stardew/${item.image.replace(/^images\//, "")}`)
}

// Recorta o PNG: ignora a margem transparente e pega só o miolo horizontal
// e a metade de cima do papel (borda rasgada + um pouco de miolo).
function recortarPapel(src, callback) {
  const img = new Image()
  img.src = src

  img.onload = () => {
    const c = document.createElement("canvas")
    c.width = img.width
    c.height = img.height
    const ctx = c.getContext("2d")
    ctx.drawImage(img, 0, 0)
    const { data } = ctx.getImageData(0, 0, c.width, c.height)

    let minX = c.width, minY = c.height, maxX = 0, maxY = 0
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        if (data[(y * c.width + x) * 4 + 3] > 20) {
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }
    if (maxX <= minX || maxY <= minY) return

    const w = maxX - minX + 1
    const h = maxY - minY + 1
    const sx = minX + Math.floor(w * 0.15)
    const sw = Math.floor(w * 0.7)
    const sh = Math.floor(h * 0.5)

    const o = document.createElement("canvas")
    o.width = sw
    o.height = sh
    const octx = o.getContext("2d")
    octx.drawImage(img, sx, minY, sw, sh, 0, 0, sw, sh)

    const [r, g, b] = octx.getImageData(Math.floor(sw / 2), sh - 1, 1, 1).data
    callback({ url: o.toDataURL(), cor: `rgb(${r}, ${g}, ${b})` })
  }
}

function Home() {
  const [texto, setTexto] = useState("")
  const [escolhido, setEscolhido] = useState(null)
  const [papel, setPapel] = useState({ url: null, cor: "#dbbf98" })

  useEffect(() => {
    recortarPapel(pergaminho, setPapel)
  }, [])

  const resultados = texto.trim() ? search(texto).slice(0, 10) : []

  function escolher(item) {
    setEscolhido(item)
    setTexto("")
  }

  return (
    <div style={{ backgroundColor: papel.cor }}>
      {/* HERO */}
      <div
        className="relative z-10 flex flex-col items-center gap-8 pb-36 text-[#783F04] bg-cover bg-center"
        style={{ backgroundImage: `url(${fundo})` }}
      >
        {/* borda rasgada no rodapé do hero, atrás da busca */}
        {papel.url && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-20 translate-y-px"
            style={{
              backgroundImage: `url(${papel.url})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "auto 100%",
              backgroundPosition: "left bottom",
              imageRendering: "pixelated",
            }}
          />
        )}

        <img className="relative z-10 w-176 mt-16" src={logo} alt="Logo" />

        <div className="relative z-20 w-128">
          <div className="flex items-center h-10 px-3 bg-white rounded-md font-popozao shadow-[-4px_3px_2px_rgba(0,0,0,0.4)]">
            <input
              className="flex-1 h-full bg-transparent outline-none placeholder:text-[#783F04] placeholder:opacity-100"
              placeholder="Search here!"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <img className="w-5" src={lupa} alt="Lupa" />
          </div>

          {resultados.length > 0 && (
            <ul className="absolute inset-x-0 z-50 mt-2 bg-white rounded-md shadow-xl max-h-60 overflow-y-auto border-2 border-[#783F04]/30">
              {resultados.map((item, i) => (
                <li
                  key={i}
                  onClick={() => escolher(item)}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-amber-100"
                >
                  <span className="flex items-center justify-center w-8 h-8 shrink-0">
                    {urlImagem(item) && (
                      <img
                        src={urlImagem(item)}
                        alt=""
                        className="max-w-full max-h-full"
                        style={{ imageRendering: "pixelated" }}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}
                  </span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* CATEGORIAS */}
      <section className="pt-10 pb-28">
        <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto px-4">
          {categorias.map((c) => (
            <Card key={c.label} {...c} />
          ))}
        </div>
      </section>

      {/* MODAL */}
      {escolhido && (
        <div
          onClick={() => setEscolhido(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg p-6 border-4 border-[#783F04] rounded-xl text-[#783F04]"
            style={{ backgroundColor: papel.cor }}
          >
            <h2 className="text-2xl font-bold">{escolhido.name}</h2>
            <p>{escolhido.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home