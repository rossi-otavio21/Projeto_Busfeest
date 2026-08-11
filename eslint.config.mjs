import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // .claude/** contém scripts de tooling instalados por skills; public/**
    // contém assets estáticos (inclui o worker vendorizado do maplibre-gl)
    ignores: ['.next/**', 'node_modules/**', '.claude/**', 'public/**'],
  },
]

export default eslintConfig
