import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    // Esta opción asegura que cualquier 404 se maneje devolviendo `index.html`
    historyApiFallback: true,
  },
});
