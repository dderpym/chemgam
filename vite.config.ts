import { defineConfig } from "vite";

export default defineConfig({
  base: "/chemgam/",
  plugins: [],
  server: { host: "0.0.0.0", port: 8000 },
  clearScreen: false,
});
