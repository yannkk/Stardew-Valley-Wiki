import { useState } from "react"
import { search, crops, fish, villagers, minerals, locations, achievements } from "stardew-valley-data"

import Card from "../components/Card"
import fundo from "../assets/fundo.png"
import logo from "../assets/logo.png"
import lupa from "../assets/lupa.png"

import cropsImg from "stardew-valley-data/images/crops/parsnip/crop.png"
import sturgeon from "stardew-valley-data/images/fish/Sturgeon.png";
import villagersImg from "stardew-valley-data/images/villagers/Abigail.png"

const categorias = [
  { icon: cropsImg, label: "Crops", count: crops().count(), color: "bg-[#3F4A2B]" },
  { icon: sturgeon, label: "Fish", count: fish().count(), color: "bg-[#3B5A73]" },
  { icon: villagersImg, label: "Villagers", count: villagers().count(), color: "bg-[#5B3F7A]" },
  { icon: "💎", label: "Minerals", count: minerals().count(), color: "bg-[#6B3A1F]" },
  { icon: "📍", label: "Locations", count: locations().count(), color: "bg-[#2F6F6A]" },
  { icon: "⭐", label: "Progress", count: achievements().count(), color: "bg-[#A07A10]" },
]

function Home() {
  const [texto, setTexto] = useState("")
  const [resultados, setResultados] = useState([])
  const [escolhido, setEscolhido] = useState(null)

  function buscar(e) {
    const valor = e.target.value
    setTexto(valor)
    setResultados(valor.trim() ? search(valor).slice(0, 10) : [])
  }

  function escolher(item) {
    setEscolhido(item)
    setResultados([])
  }

  return (
    <div>
      {/* HERO */}
      <div
        className="relative z-10 flex flex-col items-center gap-8 pb-24 text-[#783F04] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fundo})` }}
      >
        <img className="w-176 mt-16" src={logo} alt="Logo" />

        <div className="relative w-128">
          <div className="flex items-center h-10 px-3 bg-white rounded-md font-popozao shadow-[-4px_3px_2px_rgba(0,0,0,0.4)]">
            <input
              className="flex-1 h-full bg-transparent outline-none placeholder:text-[#783F04] placeholder:opacity-100"
              placeholder="Search here!"
              value={texto}
              onChange={buscar}
            />
            <img className="w-5" src={lupa} alt="Lupa" />
          </div>

          {resultados.length > 0 && (
            <ul className="absolute left-0 right-0 mt-2 bg-white rounded-md shadow-xl max-h-60 overflow-y-auto">
              {resultados.map((item, i) => (
                <li
                  key={i}
                  onClick={() => escolher(item)}
                  className="px-4 py-2 cursor-pointer hover:bg-amber-100"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* CATEGORIAS */}
      <section className="relative bg-[#E6D2A0] pt-20 pb-28">
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
            className="w-full max-w-lg p-6 bg-[#FFF8DC] border-4 border-[#783F04] rounded-xl text-[#783F04]"
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