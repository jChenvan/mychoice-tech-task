import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Item from "./pages/Item"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/item/:itemid" element={<Item/>} />
      </Routes>
    </HashRouter>
  )
}

export default App
