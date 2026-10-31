import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"
import { IdiomaProvider } from "./i18n/idioma"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <IdiomaProvider>
        <App />
      </IdiomaProvider>
    </BrowserRouter>
  </StrictMode>
)