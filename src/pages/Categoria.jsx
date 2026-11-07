import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { todos, grupos, rotulo, iconeGrupo } from "../data/modulos"
import ModalItem from "../components/ModalItem"

function caminho(item) {
  return encodeURI(`/stardew/${item.image.replace(/^images\//, "")}`)
}

function imagem(item) {
  return item.image ? caminho(item) : null
}

// Aldeões com imagem, do nome mais longo para o mais curto
const aldeoes = (todos.villagers?.().get() ?? [])
  .filter((v) => v.image && v.name)
  .sort((a, b) => b.name.length - a.name.length)

// Para itens sem imagem (como eventos), acha o aldeão pelo começo do nome:
// "Alex 2-Heart" -> retrato do Alex
function retrato(item) {
  if (item.image || !item.name) return null
  const dono = aldeoes.find(
    (v) => item.name === v.name || item.name.startsWith(v.name + " ")
  )
  return dono ? caminho(dono) : null
}

// Como separar cada módulo em seções. Sem entrada = uma seção só.
const agrupar = {
  crops: (item) => item.seasons,
  fish: (item) => item.seasons,
  villagers: (item) => [item.marriageable ? "Marriageable" : "Not marriageable"],
}

function separar(itens, funcao) {
  if (!funcao) return { All: itens }

  const resultado = {}
  for (const item of itens) {
    const nomes = [].concat(funcao(item) ?? "Other")
    for (const nome of nomes) {
      const chave = String(nome)
      if (!resultado[chave]) resultado[chave] = []
      resultado[chave].push(item)
    }
  }
  return resultado
}

function Categoria() {
  const { slug } = useParams()
  const [escolhido, setEscolhido] = useState(null)

  // o slug pode ser um grupo (gear, farm...) ou um módulo (crops, fish...)
  const grupo = grupos.find((g) => g.id === slug)

  const secoes = grupo
    ? Object.fromEntries(grupo.modulos.map((n) => [rotulo(n), todos[n]().get()]))
    : separar(todos[slug]?.().get() ?? [], agrupar[slug])

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-[#dbbf98] text-[#783F04] font-popozao overflow-x-hidden">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="inline-block py-2 text-[14px] cursor-pointer">← Voltar</Link>

        <h1 className="flex items-center gap-3 mt-1 mb-6 text-[22px] sm:text-[28px]">
          {grupo && iconeGrupo(grupo) && (
            <img
              src={iconeGrupo(grupo)}
              alt=""
              className="object-contain w-8 h-8 sm:w-10 sm:h-10"
              style={{ imageRendering: "pixelated" }}
            />
          )}
          {grupo ? grupo.titulo : rotulo(slug)}
        </h1>

        {Object.entries(secoes).map(([nome, lista]) => (
          <section key={nome} className="mb-8 sm:mb-10">
            {nome !== "All" && (
              <h2 className="mb-3 text-[16px] sm:text-[20px] capitalize border-b-2 border-[#783F04]/40">
                {nome} <span className="text-[12px] opacity-60">({lista.length})</span>
              </h2>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
              {lista.map((item, i) => {
                const foto = imagem(item)
                const rosto = foto ? null : retrato(item)

                return (
                  <button
                    key={i}
                    onClick={() => setEscolhido(item)}
                    className={
                      "min-w-0 p-3 rounded-lg bg-[#FFF8DC]/60 hover:bg-[#FFF8DC] cursor-pointer " +
                      (rosto
                        ? "flex flex-row items-center justify-center gap-2 sm:gap-3"
                        : "flex flex-col items-center gap-2")
                    }
                  >
                    {foto && (
                      <img
                        src={foto}
                        alt=""
                        className="object-contain w-10 h-10 sm:w-12 sm:h-12"
                        style={{ imageRendering: "pixelated" }}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}

                    {rosto && (
                      <img
                        src={rosto}
                        alt=""
                        className="object-contain w-8 h-8 shrink-0"
                        style={{ imageRendering: "pixelated" }}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}

                    <span className="text-[11px] leading-tight text-center break-words sm:text-[12px]">
                      {item.name ?? item.id ?? "Item"}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <ModalItem item={escolhido} onFechar={() => setEscolhido(null)} />
    </div>
  )
}

export default Categoria