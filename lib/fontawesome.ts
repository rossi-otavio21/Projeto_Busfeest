import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

/**
 * Desativa a injeção automática de CSS via JS do Font Awesome — em SSR
 * (Next.js) isso causa um flash de ícones gigantes antes do CSS carregar.
 * O CSS já vem importado acima, então a lib não precisa injetar nada.
 * Importar este módulo (por efeito colateral) uma única vez no layout raiz.
 */
config.autoAddCss = false
