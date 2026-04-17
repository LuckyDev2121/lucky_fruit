import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeRuntimeConfig } from './config/gameConfig'
import { checkIntroIntegration } from "./api/auth.ts"

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}

async function bootstrap() {
  const search = window.location.search.replace(/\?/g, "&").replace(/^&/, "?");
  const params = new URLSearchParams(search);

  const userId = Number(params.get("userid"));
  const token = Number(params.get("token"));

  await initializeRuntimeConfig();

  try {
    const res = await checkIntroIntegration(userId, token);

    if (!res.status || !res.user_id) {
      window.location.href = "/blocked";
      return;
    }

    // ✅ SAVE USER ID GLOBALLY
    localStorage.setItem("user_id", res.user_id.toString());

    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    console.error("Intro check failed", err);
    window.location.href = "/error";
  }
}
bootstrap();
