import { useState } from "react"
import { search } from "stardew-valley-data"

import labubu from "../assets/fundo.png"
import sixseven from "../assets/logo.png"
import tutorial from "../assets/lupa.png"

function Home() {

const [ListaItem, setListaItem] = useState([]);

  return (
    <div>
      <div className="w-full gap-8 text-[#783F04] min-h-screen  bg-cover bg-center bg-no-repeat flex items-center flex-col" style={{ backgroundImage: `url(${labubu})` }}>
        <div className="flex justify-center">
          <img className="w-176 mt-16" src={sixseven}></img>
        </div>
        <div>
          <div className="w-128 h-10 bg-white rounded-md font-popozao shadow-[-4px_3px_2px_rgba(0,0,0,0.4)] flex items-center pl-2">
            <input
              className="w-full h-full bg-transparent outline-none border-none placeholder:text-[#783F04] placeholder:opacity-100"
              placeholder="Search here!" 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;