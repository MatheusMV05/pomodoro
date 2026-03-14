import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Pomodoro from "./App"; // Importando o componente padrão do App.tsx

const elem = document.getElementById("root")!;
const app = (
    <StrictMode>
        <Pomodoro />
    </StrictMode>
);

if (import.meta.hot) {
    const root = (import.meta.hot.data.root ??= createRoot(elem));
    root.render(app);
} else {
    createRoot(elem).render(app);
}