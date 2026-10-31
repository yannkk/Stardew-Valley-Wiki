import * as pacote from "stardew-valley-data"

// Lista explícita de módulos (nomes do README do pacote).
// Se algum nome não existir no pacote, é ignorado sem quebrar nada.
const nomes = [
    "crops", "fish", "villagers", "minerals", "locations", "achievements",
    "tools", "weapons", "hats", "rings", "footwear", "trinkets", "tackle", "bait",
    "trees", "animals", "forageables",
    "cooking", "crafting",
    "monsters", "monsterLoot", "weaponStats",
    "events", "quests", "universalGifts",
]

export const todos = {}

for (const nome of nomes) {
    const fn = pacote[nome]
    if (typeof fn !== "function") continue
    try {
        const consulta = fn()
        if (consulta && typeof consulta.get === "function" && typeof consulta.count === "function") {
            todos[nome] = fn
        }
    } catch {
        // não é um módulo, ignora
    }
}

const principais = ["crops", "fish", "villagers", "minerals", "locations", "achievements"]
const outros = Object.keys(todos).filter((n) => !principais.includes(n))

// Grupos temáticos. Para mover um módulo de grupo, mude o nome de lugar.
// Opcional: "capa" escolhe o item cuja imagem vira o ícone do card,
// no formato { modulo: "weapons", item: "Galaxy Sword" }.
// Sem "capa" (ou se o item não existir), usa a primeira imagem do grupo.
const definicao = [
    { id: "gear", titulo: "Gear", cor: "bg-[#5A4A3A]", modulos: ["tools", "weapons", "hats", "rings", "footwear", "trinkets", "tackle", "bait"] },
    { id: "farm", titulo: "Farm & Nature", cor: "bg-[#4F6B2F]", modulos: ["trees", "animals", "forageables"] },
    { id: "food", titulo: "Food & Crafting", cor: "bg-[#8A4B2A]", modulos: ["cooking", "crafting"] },
    { id: "combat", titulo: "Combat", cor: "bg-[#7A2E2E]", modulos: ["monsters", "monsterLoot", "weaponStats"] },
]

// o que não foi listado vai para "Misc"
const usados = definicao.flatMap((g) => g.modulos)
const sobra = outros.filter((n) => !usados.includes(n))
if (sobra.length) {
  definicao.push({
    id: "misc",
    titulo: "Misc",
    cor: "bg-[#4A4A4A]",
    modulos: sobra,
    icone: "/stardew/crops/starfruit/crop.png",
  })
}

export const grupos = definicao
    .map((g) => ({ ...g, modulos: g.modulos.filter((n) => todos[n]) }))
    .filter((g) => g.modulos.length > 0)

export function totalItens(grupo) {
    return grupo.modulos.reduce((soma, n) => soma + todos[n]().count(), 0)
}

// "monsterLoot" -> "Monster Loot"
export function rotulo(chave) {
    return chave.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())
}

function caminho(item) {
    return encodeURI(`/stardew/${item.image.replace(/^images\//, "")}`)
}

export function iconeGrupo(grupo) {
  // 1. caminho direto (ex.: o Misc)
  if (grupo.icone) return grupo.icone

  // 2. item escolhido pela "capa"
  if (grupo.capa && todos[grupo.capa.modulo]) {
    try {
      const item = todos[grupo.capa.modulo]().findByName(grupo.capa.item)
      if (item?.image) return caminho(item)
    } catch {
      // segue para o automático
    }
  }

  // 3. automático: primeira imagem encontrada nos módulos do grupo
  for (const nome of grupo.modulos) {
    const item = todos[nome]().get().find((i) => i.image)
    if (item) return caminho(item)
  }
  return null
}