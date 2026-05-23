/**
 * GitHub Pages serves the project at https://<user>.github.io/<repo>/, so the app
 * needs to be built with a matching `basePath`. The deploy workflow exports
 * `NEXT_PUBLIC_BASE_PATH=/<repo-name>` before running `next build`; locally this
 * env var is unset, so the app builds at the root (good for Vercel + `next dev`).
 *
 * `output: "export"` makes `next build` emit a fully static `out/` folder.
 * @type {import('next').NextConfig}
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
