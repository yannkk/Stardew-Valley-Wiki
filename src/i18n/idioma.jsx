import { createContext, useContext, useState, useEffect } from "react"

// inglês -> português. O que não estiver aqui continua em inglês.
const dicionario = {
  // Home
  "Search here!": "Pesquise aqui!",
  "Crops": "Plantações",
  "Fish": "Peixes",
  "Villagers": "Moradores",
  "Minerals": "Minerais",
  "Locations": "Locais",
  "Progress": "Progresso",
  "Gear": "Equipamentos",
  "Farm & Nature": "Fazenda e Natureza",
  "Food & Crafting": "Comida e Criação",
  "Combat": "Combate",
  "Story & Social": "História e Social",
  "Misc": "Diversos",
  "STARDEW VALLEY - FANMADE WIKI": "STARDEW VALLEY - WIKI FEITA POR FÃ",
  "Guide non-official, made by fan": "Guia não oficial, feito por fã",
  "Made by Adryan Thesse": "Feito por Adryan Thesse",

  // Categoria
  "← Back": "← Voltar",
  "All": "Todos",
  "Other": "Outros",
  "Marriageable": "Casáveis",
  "Not marriageable": "Não casáveis",
  "spring": "primavera",
  "summer": "verão",
  "fall": "outono",
  "winter": "inverno",

  // módulos
  "Tools": "Ferramentas",
  "Weapons": "Armas",
  "Hats": "Chapéus",
  "Rings": "Anéis",
  "Footwear": "Calçados",
  "Trinkets": "Berloques",
  "Tackle": "Iscas e anzóis",
  "Bait": "Iscas",
  "Trees": "Árvores",
  "Animals": "Animais",
  "Forageables": "Coletáveis",
  "Cooking": "Culinária",
  "Crafting": "Criação",
  "Monsters": "Monstros",
  "Monster Loot": "Itens de Monstros",
  "Weapon Stats": "Status das Armas",
  "Events": "Eventos",
  "Quests": "Missões",
  "Universal Gifts": "Presentes Universais",
  "Achievements": "Conquistas",

  // Modal
  "Close": "Fechar",
  "Yes": "Sim",
  "No": "Não",
  "Sell Price": "Preço de Venda",
  "Seasons": "Estações",
  "Season": "Estação",
  "Growth Time": "Tempo de Crescimento",
  "Location": "Local",
  "Locations": "Locais",
  "Time": "Horário",
  "Weather": "Clima",
  "Difficulty": "Dificuldade",
  "Birthday": "Aniversário",
  "Marriageable ": "Casável",
  "Gifts": "Presentes",
  "Loves": "Ama",
  "Likes": "Gosta",
  "Dislikes": "Não gosta",
  "Hates": "Odeia",
  "Neutral": "Neutro",
  "Category": "Categoria",
  "Type": "Tipo",
  "Price": "Preço",
  "Buy Price": "Preço de Compra",
  "Energy": "Energia",
  "Health": "Vida",
  "Damage": "Dano",
  "Ingredients": "Ingredientes",
  "Recipe": "Receita",
  "Growth Stages": "Estágios de Crescimento",
  "Regrow Time": "Tempo de Rebrota",
  "Seed": "Semente",
  "Skill": "Habilidade",
  "Reward": "Recompensa",
  "Description": "Descrição",
}

const Ctx = createContext({ idioma: "en", t: (x) => x })

export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(() => localStorage.getItem("idioma") || "en")

  useEffect(() => {
    localStorage.setItem("idioma", idioma)
    document.documentElement.lang = idioma === "pt" ? "pt-BR" : "en"
  }, [idioma])

  const t = (texto) => (idioma === "pt" ? dicionario[texto] ?? texto : texto)

  return (
    <Ctx.Provider value={{ idioma, t }}>
      {children}
      <button
        onClick={() => setIdioma(idioma === "en" ? "pt" : "en")}
        className="fixed top-4 right-4 z-[60] px-3 py-1 text-[12px] font-popozao text-[#F3E3B3] bg-[#783F04] border-2 border-[#F3E3B3]/60 rounded-md shadow-[-3px_3px_0px_rgba(0,0,0,0.4)] hover:brightness-110"
      >
        {idioma === "en" ? "🇧🇷 PT" : "🇺🇸 EN"}
      </button>
    </Ctx.Provider>
  )
}

export const useIdioma = () => useContext(Ctx)