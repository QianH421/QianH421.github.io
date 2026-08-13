import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL ?? "").replace(/\/$/, "");

  return {
    // Relative asset URLs work both at username.github.io/repository/ and at a
    // custom domain without maintaining separate builds.
    base: "./",
    plugins: [
      react(),
      {
        name: "personal-archive-site-url",
        transformIndexHtml(html) {
          const ogImage = siteUrl ? `${siteUrl}/og.jpg` : "./og.jpg";
          return html.replaceAll("__OG_IMAGE__", ogImage);
        },
      },
    ],
  };
});
