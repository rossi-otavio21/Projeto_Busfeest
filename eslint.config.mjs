import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // .claude/** e .agents/** contêm scripts de tooling instalados por
    // skills; public/** contém assets estáticos servidos como estão
    ignores: ['.next/**', 'node_modules/**', '.claude/**', '.agents/**', 'public/**'],
  },
]

export default eslintConfig
