/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Evita que o Next gere AGENTS.md/CLAUDE.md automaticamente no repo.
  agentRules: false,
}

export default nextConfig
