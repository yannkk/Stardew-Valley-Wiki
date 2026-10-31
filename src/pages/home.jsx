import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { crops, fish, villagers, minerals, locations, achievements } from "stardew-valley-data"
import { todos, grupos, totalItens, iconeGrupo, rotulo } from "../data/modulos"

import Card from "../components/Card"
import ModalItem from "../components/ModalItem"
import fundo from "../assets/fundo.png"
import logo from "../assets/logo.png"
import lupa from "../assets/lupa.png"
import pergaminho from "../assets/pergaminho.png"
import github from "../assets/github.png"
import discord from "../assets/discord.png"
import instagram from "../assets/instagram.png"

const principais = [
  { slug: "crops", icon: "/stardew/crops/carrot/crop.png", label: "Crops", count: crops().count(), color: "bg-[#3F4A2B]" },
  { slug: "fish", icon: "/stardew/fish/Sturgeon.png", label: "Fish", count: fish().count(), color: "bg-[#3B5A73]" },
  { slug: "villagers", icon: "/stardew/villagers/Abigail.png", label: "Villagers", count: villagers().count(), color: "bg-[#5B3F7A]" },
  { slug: "minerals", icon: "/stardew/minerals/foraged-minerals/Quartz.png", label: "Minerals", count: minerals().count(), color: "bg-[#6B3A1F]" },
  { slug: "locations", icon: "/stardew/maps/icons/Standard Farm Map Icon.png", label: "Locations", count: locations().count(), color: "bg-[#2F6F6A]" },
  { slug: "achievements", icon: "/stardew/achievements/Achievement_Star_09.png", label: "Progress", count: achievements().count(), color: "bg-[#A07A10]" },
]

// os 6 principais + um card para cada grupo (Gear, Farm & Nature...)
const categorias = [
  ...principais,
  ...grupos.map((g) => ({
    slug: g.id,
    icon: iconeGrupo(g),
    label: g.titulo,
    count: totalItens(g),
    color: g.cor,
  })),
]

// "images/crops/parsnip/crop.png" -> "/stardew/crops/parsnip/crop.png"
function urlImagem(item) {
  if (!item.image) return null
  return encodeURI(`/stardew/${item.image.replace(/^images\//, "")}`)
}

// ---------- ÍNDICE DE BUSCA ----------
// 1) páginas: os cards da Home + todos os módulos (weapons, events, hats...)
const paginas = new Map()

for (const c of categorias) {
  paginas.set(c.slug, {
    slug: c.slug,
    titulo: c.label,
    busca: `${c.label} ${c.slug}`.toLowerCase(),
    imagem: c.icon,
    tag: "Page",
  })
}

for (const [nome, fn] of Object.entries(todos)) {
  if (paginas.has(nome)) continue
  const comImagem = fn().get().find((i) => i.image)
  paginas.set(nome, {
    slug: nome,
    titulo: rotulo(nome),
    busca: `${rotulo(nome)} ${nome}`.toLowerCase(),
    imagem: comImagem ? urlImagem(comImagem) : null,
    tag: "Page",
  })
}

// 2) itens de todos os módulos
const itens = Object.entries(todos).flatMap(([modulo, fn]) =>
  fn()
    .get()
    .filter((item) => item.name)
    .map((item) => ({
      item,
      titulo: item.name,
      busca: item.name.toLowerCase(),
      imagem: urlImagem(item),
      tag: rotulo(modulo),
    }))
)

const indice = [...paginas.values(), ...itens]

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
  const navigate = useNavigate()
  const [texto, setTexto] = useState("")
  const [escolhido, setEscolhido] = useState(null)
  const [papel, setPapel] = useState({ url: null, cor: "#dbbf98" })

  useEffect(() => {
    recortarPapel(pergaminho, setPapel)
  }, [])

  const termo = texto.trim().toLowerCase()

  // páginas primeiro, depois quem começa com o termo, depois o resto
  const resultados = termo
    ? indice
        .filter((r) => r.busca.includes(termo))
        .sort((a, b) => {
          const pa = a.slug ? 1 : 0
          const pb = b.slug ? 1 : 0
          if (pa !== pb) return pb - pa
          return b.busca.startsWith(termo) - a.busca.startsWith(termo)
        })
        .slice(0, 12)
    : []

  function escolher(r) {
    setTexto("")
    if (r.slug) navigate(`/${r.slug}`)
    else setEscolhido(r.item)
  }

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: papel.cor }}>
      {/* HERO */}
      <div
        className="relative z-10 flex flex-col items-center gap-6 px-4 pb-28 text-[#783F04] bg-cover bg-center sm:gap-8 sm:pb-36"
        style={{ backgroundImage: `url(${fundo})` }}
      >
        {/* borda rasgada no rodapé do hero, atrás da busca */}
        {papel.url && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-12 translate-y-px sm:h-20"
            style={{
              backgroundImage: `url(${papel.url})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "auto 100%",
              backgroundPosition: "left bottom",
              imageRendering: "pixelated",
            }}
          />
        )}

        <img className="relative z-10 w-full max-w-176 mt-10 sm:mt-16" src={logo} alt="Logo" />

        <div className="relative z-20 w-full max-w-128">
          <div className="flex items-center h-10 px-3 bg-white rounded-md font-popozao shadow-[-4px_3px_2px_rgba(0,0,0,0.4)]">
            <input
              className="flex-1 min-w-0 h-full text-[14px] bg-transparent outline-none placeholder:text-[#783F04] placeholder:opacity-100"
              placeholder="Search here!"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <img className="w-5" src={lupa} alt="Lupa" />
          </div>

          {resultados.length > 0 && (
            <ul className="absolute inset-x-0 z-50 mt-2 bg-white rounded-md shadow-xl max-h-72 overflow-y-auto border-2 border-[#783F04]/30">
              {resultados.map((r, i) => (
                <li
                  key={`${r.tag}-${r.titulo}-${i}`}
                  onClick={() => escolher(r)}
                  className="flex items-center gap-3 px-3 py-3 cursor-pointer sm:px-4 sm:py-2 hover:bg-amber-100"
                >
                  <span className="flex items-center justify-center w-8 h-8 shrink-0">
                    {r.imagem && (
                      <img
                        src={r.imagem}
                        alt=""
                        className="max-w-full max-h-full"
                        style={{ imageRendering: "pixelated" }}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}
                  </span>
                  <span className="flex-1 min-w-0 text-[14px] break-words">{r.titulo}</span>
                  <span className="text-[10px] opacity-50 shrink-0">{r.tag}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* CATEGORIAS */}
      <section className="pt-8 pb-16 sm:pt-10 sm:pb-28">
        <div className="grid grid-cols-2 gap-4 px-4 mx-auto max-w-3xl sm:grid-cols-3 sm:gap-6 md:grid-cols-4">
          {categorias.map((c) => (
            <Card key={c.slug} {...c} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#3F2E20] px-4 pt-24 pb-10 text-[#F3E3B3] font-popozao sm:px-6 sm:pt-28 sm:pb-12">
        {/* papel rasgado no topo (a mesma faixa do hero, virada de cabeça para baixo) */}
        {papel.url && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-12 scale-y-[-1] sm:h-20"
            style={{
              backgroundImage: `url(${papel.url})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "auto 100%",
              backgroundPosition: "left bottom",
              imageRendering: "pixelated",
            }}
          />
        )}

        <div>
          <p className="mb-8 text-[18px] leading-tight text-center sm:text-[28px]">
            STARDEW VALLEY - FANMADE WIKI
          </p>

          <div className="relative flex flex-col max-w-6xl gap-10 mx-auto md:flex-row md:justify-between">
            {/* ESQUERDA */}
            <div>
              <p className="mt-1 text-[12px] sm:text-[14px]">Guide non-official, made by fan</p>

              <div className="mt-10 text-[12px] sm:mt-16 sm:text-[14px]">
                <p>Made by Adryan Thesse</p>
                <p>TCC - Techers - FrontEnd</p>
                <p>2026</p>
              </div>

              <hr className="w-full mt-8 sm:mt-10 max-w-[320px] border-[#F3E3B3]/40" />

              <div className="mt-6 max-w-[320px] text-[11px] leading-[14px] opacity-40">
                <p>Data provided by the stardew-valley-data library (GitHub).</p>
                <p className="mt-3">
                  Not affiliated with ConcernedApe. Stardew Valley is a registered
                  trademark of its respective owners.
                </p>
              </div>
            </div>

            {/* DIREITA */}
            <div className="flex flex-col items-start">
              <img className="w-full max-w-[260px] md:max-w-[380px]" src={logo} alt="Logo" />

              <ul className="mt-8 space-y-4 text-[13px] md:mt-10 md:space-y-5">
                <li className="flex items-center gap-3">
                  <img className="w-7" src={github} alt="GitHub" />
                  @yannkk
                </li>
                <li className="flex items-center gap-3">
                  <img className="w-7" src={discord} alt="Discord" />
                  @ratinhokjk
                </li>
                <li className="flex items-center gap-3">
                  <img className="w-7" src={instagram} alt="Instagram" />
                  @ratookk
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <ModalItem item={escolhido} cor={papel.cor} onFechar={() => setEscolhido(null)} />
    </div>
  )
}

export default Home