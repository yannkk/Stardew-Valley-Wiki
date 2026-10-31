import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { todos, grupos, rotulo } from "../data/modulos"
import { useIdioma } from "../i18n/idioma"
import ModalItem from "../components/ModalItem"

function imagem(item) {
  if (!item.image) return null
  return encodeURI(`/stardew/${item.image.replace(/^images\//, "")}`)
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
  const { t } = useIdioma()
  const { slug } = useParams()
  const [escolhido, setEscolhido] = useState(null)

  // o slug pode ser um grupo (gear, farm...) ou um módulo (crops, fish...)
  const grupo = grupos.find((g) => g.id === slug)

  const secoes = grupo
    ? Object.fromEntries(grupo.modulos.map((n) => [rotulo(n), todos[n]().get()]))
    : separar(todos[slug]?.().get() ?? [], agrupar[slug])

  return (
    <div className="min-h-screen p-6 bg-[#dbbf98] text-[#783F04] font-popozao">
      <Link to="/">{t("← Back")}</Link>

      <h1 className="mt-2 mb-6 text-[28px]">{t(grupo ? grupo.titulo : rotulo(slug))}</h1>

      {Object.entries(secoes).map(([nome, lista]) => (
        <section key={nome} className="mb-10">
          {nome !== "All" && (
            <h2 className="mb-3 text-[20px] capitalize border-b-2 border-[#783F04]/40">
              {t(nome)} <span className="text-[12px] opacity-60">({lista.length})</span>
            </h2>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {lista.map((item, i) => (
              <button
                key={i}
                onClick={() => setEscolhido(item)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#FFF8DC]/60 hover:bg-[#FFF8DC]"
              >
                {imagem(item) && (
                  <img
                    src={imagem(item)}
                    alt=""
                    className="w-12 h-12 object-contain"
                    style={{ imageRendering: "pixelated" }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <span className="text-[12px]">{item.name ?? item.id ?? "Item"}</span>
              </button>
            ))}
          </div>
        </section>
      ))}

      <ModalItem item={escolhido} onFechar={() => setEscolhido(null)} />
    </div>
  )
}

export default Categoria