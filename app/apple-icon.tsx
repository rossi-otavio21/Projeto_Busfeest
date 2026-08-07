import { ImageResponse } from 'next/og'

// Mesmo símbolo de marca usado em app/icon.svg e components/brand/logo.tsx,
// gerado em 180x180 (tamanho padrão do Apple touch icon) com fundo sólido
// para boa legibilidade em telas de iOS.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg
        width={180}
        height={180}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="12" fill="#122B42" />
        <path
          d="M16 12c8 0 8 8 0 8h6c8 0 8 8 0 8h-6"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M14 34h13"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="1 5"
        />
        <path
          d="M30 30l5 4-5 4"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    { ...size },
  )
}
