import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  //file and add the base property. The value is the name of your repository with leading and trailing slashes.
  base: "/Personal-Trainer-React-App/",
  plugins: [react()],
});
