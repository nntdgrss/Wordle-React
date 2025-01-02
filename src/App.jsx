import { BrowserRouter, Routes, Route } from "react-router";
import Menu from "./components/Menu/Menu";
import NotFound from "./components/Errors/NotFound";
import Game from "./components/Game/Game";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/game" element={<Game />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
