import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/lucky-fruits/",   // 👈 THIS IS REQUIRED
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://funint.site/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});