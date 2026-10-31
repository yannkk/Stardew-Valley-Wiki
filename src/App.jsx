import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Categoria from "./pages/Categoria"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:slug" element={<Categoria />} />
    </Routes>
  )
}

export default App