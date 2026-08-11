'use client'

import { useCallback, useEffect, useState } from 'react'
import { setWorkerUrl } from 'maplibre-gl'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBus, faCity } from '@fortawesome/free-solid-svg-icons'
import { Map, FlightAirport, FlightRoute } from '@/components/ui/flightcn-flight-multi-route'
import { usePrefersReducedMotion } from '@/lib/motion'
import { rotasBase, rotasDestinos, rotasEnquadramento } from './rotas-data'

// O Turbopack não resolve o module worker interno do maplibre-gl (a request
// do worker volta como HTML 404 → "Failed to load module script" → o estilo
// nunca carrega). Servimos o worker nós mesmos: maplibre-gl-worker.mjs e
// maplibre-gl-shared.mjs foram copiados de node_modules/maplibre-gl/dist
// para /public — ao atualizar a lib, copie os dois de novo (versão 6.2.0).
if (typeof window !== 'undefined') {
  setWorkerUrl('/maplibre-gl-worker.mjs')
}

/** Rótulo das cidades — pílula escura para o nome não sumir sobre o mapa. */
const labelBase =
  'rounded-full bg-navy-deep/85 px-2 py-0.5 backdrop-blur-sm ring-1 ring-white/10'

/** Pino da base — ônibus pulsante, com o mesmo faBus da navegação do site. */
function BusPin() {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center md:h-9 md:w-9">
      <span className="absolute h-10 w-10 animate-ping rounded-full bg-blue/25 md:h-11 md:w-11" />
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue shadow-[0_0_16px_3px_rgba(54,149,197,0.8)] md:h-9 md:w-9">
        <FontAwesomeIcon icon={faBus} className="h-3.5 w-3.5 text-white md:h-4 md:w-4" aria-hidden="true" />
      </span>
    </span>
  )
}

/**
 * Pino de destino — cidade/edifícios, em branco/cinza neutro. O azul fica
 * reservado à base e ao ônibus em movimento (ver nota em BusPin acima);
 * assim os destinos ficam calmos no mapa e não competem com a rota.
 */
function CityPin() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/70 bg-navy-deep shadow-[0_2px_8px_rgba(0,0,0,0.45)] md:h-7 md:w-7">
      <FontAwesomeIcon icon={faCity} className="h-2.5 w-2.5 text-white/80 md:h-3 md:w-3" aria-hidden="true" />
    </span>
  )
}

/** Ônibus em viagem — o marcador que percorre o arco de cada rota. */
function BusEmViagem() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-[0_0_12px_3px_rgba(54,149,197,0.9)]">
      <FontAwesomeIcon icon={faBus} className="h-3 w-3 text-navy" aria-hidden="true" />
    </span>
  )
}

/**
 * Mapa da rede de rotas — Brasil estilizado de fundo (estados do IBGE em
 * /public/geo/br-estados.json, sem servidor de tiles externo), base Alfenas
 * ligada aos destinos por arcos iluminados, pino de ônibus em cada cidade e
 * um ônibus viajando em cada rota (desligado sob prefers-reduced-motion).
 *
 * Não-interativo de propósito: é grafismo da seção, não ferramenta de
 * navegação — e assim não captura o scroll da página no mobile.
 */
export function RotasFlightMap() {
  const reduceMotion = usePrefersReducedMotion()

  // O estilo vai por URL, não como objeto inline: no maplibre-gl 6.2.0 um
  // estilo passado como objeto trava antes do `styledata` (verificado no
  // navegador — por URL os eventos disparam normalmente). O JSON vive em
  // /public/geo/estilo-brasil.json e referencia br-estados.json relativo.
  const brasilStyleUrl = '/geo/estilo-brasil.json'

  const [mapa, setMapa] = useState<MapLibreMap | null>(null)

  const handleMapRef = useCallback((map: MapLibreMap | null) => {
    setMapa(map)
    if (map && process.env.NODE_ENV !== 'production') {
      map.on('error', (event: { error: Error }) => {
        console.error('[RotasFlightMap] erro do MapLibre:', event.error)
      })
    }
  }, [])

  // Reenquadra conforme a largura real do contêiner (e de novo a cada resize,
  // ex.: girar o celular). O evento `resize` do próprio mapa garante que o
  // canvas já está no tamanho novo quando o fitBounds roda.
  useEffect(() => {
    if (!mapa) return

    const enquadrar = () => {
      const estreito = mapa.getContainer().clientWidth < 640
      mapa.fitBounds(
        estreito ? rotasEnquadramento.mobile : rotasEnquadramento.desktop,
        { padding: estreito ? 44 : 32, duration: 0 },
      )
    }

    enquadrar()
    mapa.on('resize', enquadrar)
    return () => {
      mapa.off('resize', enquadrar)
    }
  }, [mapa])

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-deep shadow-2xl md:h-[460px]">
      <Map
        ref={handleMapRef}
        theme="dark"
        styles={{ dark: brasilStyleUrl, light: brasilStyleUrl }}
        interactive={false}
        attributionControl={false}
        // Enquadramento inicial; o efeito acima reajusta pela largura real.
        bounds={rotasEnquadramento.desktop}
        fitBoundsOptions={{ padding: 32 }}
      >
        {/* Arcos de rota: camada de brilho larga + traço principal fino */}
        {rotasDestinos.map((destino) => (
          <FlightRoute
            key={`glow-${destino.name}`}
            id={`glow-${destino.name}`}
            from={rotasBase.coords}
            to={destino.coords}
            color="#3695C5"
            width={7}
            opacity={0.16}
            interactive={false}
            hoverEffect={false}
          />
        ))}
        {rotasDestinos.map((destino, index) => (
          <FlightRoute
            key={destino.name}
            id={`rota-${destino.name}`}
            from={rotasBase.coords}
            to={destino.coords}
            color="#3695C5"
            width={2}
            opacity={0.9}
            lineStyle="dash"
            interactive={false}
            hoverEffect={false}
            animate={
              reduceMotion
                ? false
                : {
                    // Duração proporcional à distância — ônibus em ritmos diferentes
                    duration: 5200 + index * 900,
                    iconSize: 20,
                    icon: <BusEmViagem />,
                  }
            }
          />
        ))}

        {/* Base Alfenas — ônibus em destaque, pulsante */}
        <FlightAirport
          longitude={rotasBase.coords[0]}
          latitude={rotasBase.coords[1]}
          name="Alfenas · base"
          showLabel
          labelPosition="bottom"
          labelClassName={`${labelBase} !text-white text-[11px] font-bold tracking-wide`}
          markerContent={<BusPin />}
        />

        {/* Destinos — cada cidade na sua coordenada real */}
        {rotasDestinos.map((destino) => (
          <FlightAirport
            key={destino.name}
            longitude={destino.coords[0]}
            latitude={destino.coords[1]}
            name={destino.name}
            showLabel
            labelPosition={destino.labelPosition}
            labelClassName={`${labelBase} !text-white/85 text-[10px] font-semibold tracking-wide`}
            markerContent={<CityPin />}
          />
        ))}
      </Map>

      {/* Vinheta sutil para integrar o mapa ao fundo navy da seção */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_60px_20px_rgba(11,26,40,0.55)]"
      />
    </div>
  )
}
