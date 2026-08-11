"use client";

/* eslint-disable react-hooks/refs -- componente vendorizado do registro
   flightcn: sincroniza refs durante o render de propósito (padrão "latest
   ref" para bridging com a API imperativa do MapLibre). */

/**
 * flightcn — mapa de rotas sobre MapLibre GL (via registro 21st.dev).
 *
 * Adaptações locais (documentadas):
 * 1. Imports de @turf movidos do meio do arquivo para o topo (lint import/first).
 * 2. A base `airports` original (~700 aeroportos IATA do mundo todo) foi
 *    reduzida aos aeroportos brasileiros relevantes — este projeto referencia
 *    pontos por coordenadas [lng, lat], então a base completa só inflaria o
 *    bundle do cliente. Para usar códigos IATA fora do Brasil, reponha a
 *    entrada correspondente aqui.
 */

import * as MapLibreGL from "maplibre-gl";
import type { PopupOptions, MarkerOptions } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import greatCircle from "@turf/great-circle";
import bearing from "@turf/bearing";
import {
  Children,
  createContext,
  type ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, Locate, Maximize, Loader2 } from "lucide-react";

function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

const defaultStyles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

type Theme = "light" | "dark";

// Check document class for theme (works with next-themes, etc.)
function getDocumentTheme(): Theme | null {
  if (typeof document === "undefined") return null;
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return null;
}

// Get system preference
function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function useResolvedTheme(themeProp?: "light" | "dark"): Theme {
  const [detectedTheme, setDetectedTheme] = useState<Theme>(
    () => getDocumentTheme() ?? getSystemTheme(),
  );

  useEffect(() => {
    if (themeProp) return; // Skip detection if theme is provided via prop

    // Watch for document class changes (e.g., next-themes toggling dark class)
    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme();
      if (docTheme) {
        setDetectedTheme(docTheme);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also watch for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Only use system preference if no document class is set
      if (!getDocumentTheme()) {
        setDetectedTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [themeProp]);

  return themeProp ?? detectedTheme;
}

type MapContextValue = {
  map: MapLibreGL.Map | null;
  isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a Map component");
  }
  return context;
}

/** Map viewport state */
type MapViewport = {
  /** Center coordinates [longitude, latitude] */
  center: [number, number];
  /** Zoom level */
  zoom: number;
  /** Bearing (rotation) in degrees */
  bearing: number;
  /** Pitch (tilt) in degrees */
  pitch: number;
};

type MapStyleOption = string | MapLibreGL.StyleSpecification;

type MapRef = MapLibreGL.Map | null;

function assignMapRef(
  ref: ForwardedRef<MapLibreGL.Map>,
  value: MapLibreGL.Map | null,
) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

type MapProps = {
  children?: ReactNode;
  /** Additional CSS classes for the map container */
  className?: string;
  /**
   * Theme for the map. If not provided, automatically detects system preference.
   * Pass your theme value here.
   */
  theme?: Theme;
  /** Custom map styles for light and dark themes. Overrides the default Carto styles. */
  styles?: {
    light?: MapStyleOption;
    dark?: MapStyleOption;
  };
  /** Map projection type. Use `{ type: "globe" }` for 3D globe view. */
  projection?: MapLibreGL.ProjectionSpecification;
  /**
   * Controlled viewport. When provided with onViewportChange,
   * the map becomes controlled and viewport is driven by this prop.
   */
  viewport?: Partial<MapViewport>;
  /**
   * Callback fired continuously as the viewport changes (pan, zoom, rotate, pitch).
   * Can be used standalone to observe changes, or with `viewport` prop
   * to enable controlled mode where the map viewport is driven by your state.
   */
  onViewportChange?: (viewport: MapViewport) => void;
} & Omit<MapLibreGL.MapOptions, "container" | "style">;

function DefaultLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex gap-1">
        <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full" />
        <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:150ms]" />
        <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function getViewport(map: MapLibreGL.Map): MapViewport {
  const center = map.getCenter();
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
}

const Map = forwardRef<MapRef, MapProps>(function Map(
  {
    children,
    className,
    theme: themeProp,
    styles,
    projection,
    viewport,
    onViewportChange,
    ...props
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<MapLibreGL.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const currentStyleRef = useRef<MapStyleOption | null>(null);
  const styleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const internalUpdateRef = useRef(false);
  const resolvedTheme = useResolvedTheme(themeProp);

  const isControlled = viewport !== undefined && onViewportChange !== undefined;

  const onViewportChangeRef = useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles],
  );

  // Keep the forwarded ref in sync so parents can safely observe `null`
  // before the MapLibre instance is created and after teardown.
  useEffect(() => {
    assignMapRef(ref, mapInstance);

    return () => {
      assignMapRef(ref, null);
    };
  }, [ref, mapInstance]);

  // MapLibre does not always pick up container size changes (flex, breakpoints,
  // orientation). Resize the map when the container box changes.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      mapInstance?.resize();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mapInstance]);

  const clearStyleTimeout = useCallback(() => {
    if (styleTimeoutRef.current) {
      clearTimeout(styleTimeoutRef.current);
      styleTimeoutRef.current = null;
    }
  }, []);

  // Initialize the map
  useEffect(() => {
    if (!containerRef.current) return;

    const initialStyle =
      resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
    currentStyleRef.current = initialStyle;

    const map = new MapLibreGL.Map({
      container: containerRef.current,
      style: initialStyle,
      renderWorldCopies: false,
      attributionControl: {
        compact: true,
      },
      ...props,
      ...viewport,
    });

    const styleDataHandler = () => {
      clearStyleTimeout();
      // Delay to ensure style is fully processed before allowing layer operations
      // This is a workaround to avoid race conditions with the style loading
      // else we have to force update every layer on setStyle change
      styleTimeoutRef.current = setTimeout(() => {
        setIsStyleLoaded(true);
        if (projection) {
          map.setProjection(projection);
        }
      }, 100);
    };
    const loadHandler = () => setIsLoaded(true);

    // Viewport change handler - skip if triggered by internal update
    const handleMove = () => {
      if (internalUpdateRef.current) return;
      onViewportChangeRef.current?.(getViewport(map));
    };

    map.on("load", loadHandler);
    map.on("styledata", styleDataHandler);
    map.on("move", handleMove);
    setMapInstance(map);

    return () => {
      clearStyleTimeout();
      map.off("load", loadHandler);
      map.off("styledata", styleDataHandler);
      map.off("move", handleMove);
      map.remove();
      setIsLoaded(false);
      setIsStyleLoaded(false);
      setMapInstance(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync controlled viewport to map
  useEffect(() => {
    if (!mapInstance || !isControlled || !viewport) return;
    if (mapInstance.isMoving()) return;

    const current = getViewport(mapInstance);
    const next = {
      center: viewport.center ?? current.center,
      zoom: viewport.zoom ?? current.zoom,
      bearing: viewport.bearing ?? current.bearing,
      pitch: viewport.pitch ?? current.pitch,
    };

    if (
      next.center[0] === current.center[0] &&
      next.center[1] === current.center[1] &&
      next.zoom === current.zoom &&
      next.bearing === current.bearing &&
      next.pitch === current.pitch
    ) {
      return;
    }

    internalUpdateRef.current = true;
    mapInstance.jumpTo(next);
    internalUpdateRef.current = false;
  }, [mapInstance, isControlled, viewport]);

  // Handle style change
  useEffect(() => {
    if (!mapInstance || !resolvedTheme) return;

    const newStyle =
      resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;

    if (currentStyleRef.current === newStyle) return;

    clearStyleTimeout();
    currentStyleRef.current = newStyle;
    setIsStyleLoaded(false);

    mapInstance.setStyle(newStyle, { diff: true });
  }, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout]);

  // Keep projection in sync with prop changes after the map is created.
  useEffect(() => {
    if (!mapInstance || !isStyleLoaded) return;

    mapInstance.setProjection(projection ?? { type: "mercator" });
  }, [mapInstance, isStyleLoaded, projection]);

  const contextValue = useMemo(
    () => ({
      map: mapInstance,
      isLoaded: isLoaded && isStyleLoaded,
    }),
    [mapInstance, isLoaded, isStyleLoaded],
  );

  return (
    <MapContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn("relative h-full w-full", className)}
      >
        {!isLoaded && <DefaultLoader />}
        {/* SSR-safe: children render only when map is loaded on client */}
        {mapInstance && children}
      </div>
    </MapContext.Provider>
  );
});

type MarkerContextValue = {
  marker: MapLibreGL.Marker;
  map: MapLibreGL.Map | null;
};

const MarkerContext = createContext<MarkerContextValue | null>(null);

function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error("Marker components must be used within MapMarker");
  }
  return context;
}

type MapMarkerProps = {
  /** Longitude coordinate for marker position */
  longitude: number;
  /** Latitude coordinate for marker position */
  latitude: number;
  /** Marker subcomponents (MarkerContent, MarkerPopup, MarkerTooltip, MarkerLabel) */
  children: ReactNode;
  /** Callback when marker is clicked */
  onClick?: (e: MouseEvent) => void;
  /** Callback when mouse enters marker */
  onMouseEnter?: (e: MouseEvent) => void;
  /** Callback when mouse leaves marker */
  onMouseLeave?: (e: MouseEvent) => void;
  /** Callback when marker drag starts (requires draggable: true) */
  onDragStart?: (lngLat: { lng: number; lat: number }) => void;
  /** Callback during marker drag (requires draggable: true) */
  onDrag?: (lngLat: { lng: number; lat: number }) => void;
  /** Callback when marker drag ends (requires draggable: true) */
  onDragEnd?: (lngLat: { lng: number; lat: number }) => void;
} & Omit<MarkerOptions, "element">;

function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd,
  draggable = false,
  ...markerOptions
}: MapMarkerProps) {
  const { map } = useMap();

  const callbacksRef = useRef({
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
  });
  callbacksRef.current = {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
  };

  const marker = useMemo(() => {
    const markerInstance = new MapLibreGL.Marker({
      ...markerOptions,
      element: document.createElement("div"),
      draggable,
    }).setLngLat([longitude, latitude]);

    const handleClick = (e: MouseEvent) => callbacksRef.current.onClick?.(e);
    const handleMouseEnter = (e: MouseEvent) =>
      callbacksRef.current.onMouseEnter?.(e);
    const handleMouseLeave = (e: MouseEvent) =>
      callbacksRef.current.onMouseLeave?.(e);

    markerInstance.getElement()?.addEventListener("click", handleClick);
    markerInstance
      .getElement()
      ?.addEventListener("mouseenter", handleMouseEnter);
    markerInstance
      .getElement()
      ?.addEventListener("mouseleave", handleMouseLeave);

    const handleDragStart = () => {
      const lngLat = markerInstance.getLngLat();
      callbacksRef.current.onDragStart?.({ lng: lngLat.lng, lat: lngLat.lat });
    };
    const handleDrag = () => {
      const lngLat = markerInstance.getLngLat();
      callbacksRef.current.onDrag?.({ lng: lngLat.lng, lat: lngLat.lat });
    };
    const handleDragEnd = () => {
      const lngLat = markerInstance.getLngLat();
      callbacksRef.current.onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat });
    };

    markerInstance.on("dragstart", handleDragStart);
    markerInstance.on("drag", handleDrag);
    markerInstance.on("dragend", handleDragEnd);

    return markerInstance;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map) return;

    marker.addTo(map);

    return () => {
      marker.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  if (
    marker.getLngLat().lng !== longitude ||
    marker.getLngLat().lat !== latitude
  ) {
    marker.setLngLat([longitude, latitude]);
  }
  if (marker.isDraggable() !== draggable) {
    marker.setDraggable(draggable);
  }

  const currentOffset = marker.getOffset();
  const newOffset = markerOptions.offset ?? [0, 0];
  const [newOffsetX, newOffsetY] = Array.isArray(newOffset)
    ? newOffset
    : [newOffset.x, newOffset.y];
  if (currentOffset.x !== newOffsetX || currentOffset.y !== newOffsetY) {
    marker.setOffset(newOffset);
  }

  if (marker.getRotation() !== markerOptions.rotation) {
    marker.setRotation(markerOptions.rotation ?? 0);
  }
  if (marker.getRotationAlignment() !== markerOptions.rotationAlignment) {
    marker.setRotationAlignment(markerOptions.rotationAlignment ?? "auto");
  }
  if (marker.getPitchAlignment() !== markerOptions.pitchAlignment) {
    marker.setPitchAlignment(markerOptions.pitchAlignment ?? "auto");
  }

  return (
    <MarkerContext.Provider value={{ marker, map }}>
      {children}
    </MarkerContext.Provider>
  );
}

type MarkerContentProps = {
  /** Custom marker content. Defaults to a blue dot if not provided */
  children?: ReactNode;
  /** Additional CSS classes for the marker container */
  className?: string;
};

function MarkerContent({ children, className }: MarkerContentProps) {
  const { marker } = useMarkerContext();
  const normalizedChildren = Children.toArray(children);

  return createPortal(
    <div className={cn("relative cursor-pointer", className)}>
      {normalizedChildren.length > 0 ? (
        normalizedChildren
      ) : (
        <DefaultMarkerIcon />
      )}
    </div>,
    marker.getElement(),
  );
}

function DefaultMarkerIcon() {
  return (
    <div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
  );
}

type MarkerPopupProps = {
  /** Popup content */
  children: ReactNode;
  /** Additional CSS classes for the popup container */
  className?: string;
  /** Show a close button in the popup (default: false) */
  closeButton?: boolean;
} & Omit<PopupOptions, "className" | "closeButton">;

function MarkerPopup({
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MarkerPopupProps) {
  const { marker, map } = useMarkerContext();
  const container = useMemo(() => document.createElement("div"), []);
  const prevPopupOptions = useRef(popupOptions);

  const popup = useMemo(() => {
    const popupInstance = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth("none")
      .setDOMContent(container);

    return popupInstance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map) return;

    popup.setDOMContent(container);
    marker.setPopup(popup);

    return () => {
      marker.setPopup(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  if (popup.isOpen()) {
    const prev = prevPopupOptions.current;

    if (prev.offset !== popupOptions.offset) {
      popup.setOffset(popupOptions.offset ?? 16);
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popup.setMaxWidth(popupOptions.maxWidth ?? "none");
    }

    prevPopupOptions.current = popupOptions;
  }

  const handleClose = () => popup.remove();

  return createPortal(
    <div
      className={cn(
        "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 relative rounded-md border p-3 shadow-md",
        className,
      )}
    >
      {closeButton && (
        <button
          type="button"
          onClick={handleClose}
          className="ring-offset-background focus:ring-ring absolute top-1 right-1 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>,
    container,
  );
}

type MarkerTooltipProps = {
  /** Tooltip content */
  children: ReactNode;
  /** Additional CSS classes for the tooltip container */
  className?: string;
} & Omit<PopupOptions, "className" | "closeButton" | "closeOnClick">;

function MarkerTooltip({
  children,
  className,
  ...popupOptions
}: MarkerTooltipProps) {
  const { marker, map } = useMarkerContext();
  const container = useMemo(() => document.createElement("div"), []);
  const prevTooltipOptions = useRef(popupOptions);

  const tooltip = useMemo(() => {
    const tooltipInstance = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeOnClick: true,
      closeButton: false,
    }).setMaxWidth("none");

    return tooltipInstance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map) return;

    tooltip.setDOMContent(container);

    const handleMouseEnter = () => {
      tooltip.setLngLat(marker.getLngLat()).addTo(map);
    };
    const handleMouseLeave = () => tooltip.remove();

    marker.getElement()?.addEventListener("mouseenter", handleMouseEnter);
    marker.getElement()?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      marker.getElement()?.removeEventListener("mouseenter", handleMouseEnter);
      marker.getElement()?.removeEventListener("mouseleave", handleMouseLeave);
      tooltip.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  if (tooltip.isOpen()) {
    const prev = prevTooltipOptions.current;

    if (prev.offset !== popupOptions.offset) {
      tooltip.setOffset(popupOptions.offset ?? 16);
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      tooltip.setMaxWidth(popupOptions.maxWidth ?? "none");
    }

    prevTooltipOptions.current = popupOptions;
  }

  return createPortal(
    <div
      className={cn(
        "bg-foreground text-background animate-in fade-in-0 zoom-in-95 rounded-md px-2 py-1 text-xs shadow-md",
        className,
      )}
    >
      {children}
    </div>,
    container,
  );
}

type MarkerLabelProps = {
  /** Label text content */
  children: ReactNode;
  /** Additional CSS classes for the label */
  className?: string;
  /** Position of the label relative to the marker (default: "top") */
  position?: "top" | "bottom";
};

function MarkerLabel({
  children,
  className,
  position = "top",
}: MarkerLabelProps) {
  const positionClasses = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
  };

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
        "text-foreground text-[10px] font-medium",
        positionClasses[position],
        className,
      )}
    >
      {children}
    </div>
  );
}

type MapControlsProps = {
  /** Position of the controls on the map (default: "bottom-right") */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Show zoom in/out buttons (default: true) */
  showZoom?: boolean;
  /** Show compass button to reset bearing (default: false) */
  showCompass?: boolean;
  /** Show locate button to find user's location (default: false) */
  showLocate?: boolean;
  /** Show fullscreen toggle button (default: false) */
  showFullscreen?: boolean;
  /** Additional CSS classes for the controls container */
  className?: string;
  /** Callback with user coordinates when located */
  onLocate?: (coords: { longitude: number; latitude: number }) => void;
};

const positionClasses = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-10 right-2",
};

function ControlGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border bg-background [&>button:not(:last-child)]:border-border flex flex-col overflow-hidden rounded-md border shadow-sm [&>button:not(:last-child)]:border-b">
      {children}
    </div>
  );
}

function ControlButton({
  onClick,
  label,
  children,
  disabled = false,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      type="button"
      className={cn(
        "hover:bg-accent dark:hover:bg-accent/40 flex size-8 items-center justify-center transition-colors",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function MapControls({
  position = "bottom-right",
  showZoom = true,
  showCompass = false,
  showLocate = false,
  showFullscreen = false,
  className,
  onLocate,
}: MapControlsProps) {
  const { map } = useMap();
  const [waitingForLocation, setWaitingForLocation] = useState(false);

  const handleZoomIn = useCallback(() => {
    map?.zoomTo(map.getZoom() + 1, { duration: 300 });
  }, [map]);

  const handleZoomOut = useCallback(() => {
    map?.zoomTo(map.getZoom() - 1, { duration: 300 });
  }, [map]);

  const handleResetBearing = useCallback(() => {
    map?.resetNorthPitch({ duration: 300 });
  }, [map]);

  const handleLocate = useCallback(() => {
    setWaitingForLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
          };
          map?.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 14,
            duration: 1500,
          });
          onLocate?.(coords);
          setWaitingForLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setWaitingForLocation(false);
        },
      );
    }
  }, [map, onLocate]);

  const handleFullscreen = useCallback(() => {
    const container = map?.getContainer();
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, [map]);

  return (
    <div
      className={cn(
        "absolute z-10 flex flex-col gap-1.5",
        positionClasses[position],
        className,
      )}
    >
      {showZoom && (
        <ControlGroup>
          <ControlButton onClick={handleZoomIn} label="Zoom in">
            <Plus className="size-4" />
          </ControlButton>
          <ControlButton onClick={handleZoomOut} label="Zoom out">
            <Minus className="size-4" />
          </ControlButton>
        </ControlGroup>
      )}
      {showCompass && (
        <ControlGroup>
          <CompassButton onClick={handleResetBearing} />
        </ControlGroup>
      )}
      {showLocate && (
        <ControlGroup>
          <ControlButton
            onClick={handleLocate}
            label="Find my location"
            disabled={waitingForLocation}
          >
            {waitingForLocation ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Locate className="size-4" />
            )}
          </ControlButton>
        </ControlGroup>
      )}
      {showFullscreen && (
        <ControlGroup>
          <ControlButton onClick={handleFullscreen} label="Toggle fullscreen">
            <Maximize className="size-4" />
          </ControlButton>
        </ControlGroup>
      )}
    </div>
  );
}

function CompassButton({ onClick }: { onClick: () => void }) {
  const { map } = useMap();
  const compassRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!map || !compassRef.current) return;

    const compass = compassRef.current;

    const updateRotation = () => {
      const bearing = map.getBearing();
      const pitch = map.getPitch();
      compass.style.transform = `rotateX(${pitch}deg) rotateZ(${-bearing}deg)`;
    };

    map.on("rotate", updateRotation);
    map.on("pitch", updateRotation);
    updateRotation();

    return () => {
      map.off("rotate", updateRotation);
      map.off("pitch", updateRotation);
    };
  }, [map]);

  return (
    <ControlButton onClick={onClick} label="Reset bearing to north">
      <svg
        ref={compassRef}
        viewBox="0 0 24 24"
        className="size-5 transition-transform duration-200"
        style={{ transformStyle: "preserve-3d" }}
      >
        <path d="M12 2L16 12H12V2Z" className="fill-red-500" />
        <path d="M12 2L8 12H12V2Z" className="fill-red-300" />
        <path d="M12 22L16 12H12V22Z" className="fill-muted-foreground/60" />
        <path d="M12 22L8 12H12V22Z" className="fill-muted-foreground/30" />
      </svg>
    </ControlButton>
  );
}

type MapPopupProps = {
  /** Longitude coordinate for popup position */
  longitude: number;
  /** Latitude coordinate for popup position */
  latitude: number;
  /** Callback when popup is closed */
  onClose?: () => void;
  /** Popup content */
  children: ReactNode;
  /** Additional CSS classes for the popup container */
  className?: string;
  /** Show a close button in the popup (default: false) */
  closeButton?: boolean;
} & Omit<PopupOptions, "className" | "closeButton">;

function MapPopup({
  longitude,
  latitude,
  onClose,
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MapPopupProps) {
  const { map } = useMap();
  const popupOptionsRef = useRef(popupOptions);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const container = useMemo(() => document.createElement("div"), []);

  const popup = useMemo(() => {
    const popupInstance = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth("none")
      .setLngLat([longitude, latitude]);

    return popupInstance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map) return;

    const onCloseProp = () => onCloseRef.current?.();

    popup.on("close", onCloseProp);

    popup.setDOMContent(container);
    popup.addTo(map);

    return () => {
      popup.off("close", onCloseProp);
      if (popup.isOpen()) {
        popup.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  if (popup.isOpen()) {
    const prev = popupOptionsRef.current;

    if (
      popup.getLngLat().lng !== longitude ||
      popup.getLngLat().lat !== latitude
    ) {
      popup.setLngLat([longitude, latitude]);
    }

    if (prev.offset !== popupOptions.offset) {
      popup.setOffset(popupOptions.offset ?? 16);
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popup.setMaxWidth(popupOptions.maxWidth ?? "none");
    }
    popupOptionsRef.current = popupOptions;
  }

  const handleClose = () => {
    popup.remove();
  };

  return createPortal(
    <div
      className={cn(
        "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 relative rounded-md border p-3 shadow-md",
        className,
      )}
    >
      {closeButton && (
        <button
          type="button"
          onClick={handleClose}
          className="ring-offset-background focus:ring-ring absolute top-1 right-1 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>,
    container,
  );
}

type MapRouteProps = {
  /** Optional unique identifier for the route layer */
  id?: string;
  /** Array of [longitude, latitude] coordinate pairs defining the route */
  coordinates: [number, number][];
  /** Line color as CSS color value (default: "#4285F4") */
  color?: string;
  /** Line width in pixels (default: 3) */
  width?: number;
  /** Line opacity from 0 to 1 (default: 0.8) */
  opacity?: number;
  /** Dash pattern [dash length, gap length] for dashed lines */
  dashArray?: [number, number];
  /** Callback when the route line is clicked */
  onClick?: () => void;
  /** Callback when mouse enters the route line */
  onMouseEnter?: () => void;
  /** Callback when mouse leaves the route line */
  onMouseLeave?: () => void;
  /** Whether the route is interactive - shows pointer cursor on hover (default: true) */
  interactive?: boolean;
};

function MapRoute({
  id: propId,
  coordinates,
  color = "#4285F4",
  width = 3,
  opacity = 0.8,
  dashArray,
  onClick,
  onMouseEnter,
  onMouseLeave,
  interactive = true,
}: MapRouteProps) {
  const { map, isLoaded } = useMap();
  const autoId = useId();
  const id = propId ?? autoId;
  const sourceId = `route-source-${id}`;
  const layerId = `route-layer-${id}`;

  // Add source and layer on mount
  useEffect(() => {
    if (!isLoaded || !map) return;

    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: [] },
      },
    });

    map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": color,
        "line-width": width,
        "line-opacity": opacity,
        ...(dashArray && { "line-dasharray": dashArray }),
      },
    });

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  // When coordinates change, update the source data
  useEffect(() => {
    if (!isLoaded || !map || coordinates.length < 2) return;

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
    if (source) {
      source.setData({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates },
      });
    }
  }, [isLoaded, map, coordinates, sourceId]);

  useEffect(() => {
    if (!isLoaded || !map || !map.getLayer(layerId)) return;

    map.setPaintProperty(layerId, "line-color", color);
    map.setPaintProperty(layerId, "line-width", width);
    map.setPaintProperty(layerId, "line-opacity", opacity);
    if (dashArray) {
      map.setPaintProperty(layerId, "line-dasharray", dashArray);
    }
  }, [isLoaded, map, layerId, color, width, opacity, dashArray]);

  // Handle click and hover events
  useEffect(() => {
    if (!isLoaded || !map || !interactive) return;

    const handleClick = () => {
      onClick?.();
    };
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
      onMouseEnter?.();
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      onMouseLeave?.();
    };

    map.on("click", layerId, handleClick);
    map.on("mouseenter", layerId, handleMouseEnter);
    map.on("mouseleave", layerId, handleMouseLeave);

    return () => {
      map.off("click", layerId, handleClick);
      map.off("mouseenter", layerId, handleMouseEnter);
      map.off("mouseleave", layerId, handleMouseLeave);
    };
  }, [
    isLoaded,
    map,
    layerId,
    onClick,
    onMouseEnter,
    onMouseLeave,
    interactive,
  ]);

  return null;
}

type MapClusterLayerProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  /** GeoJSON FeatureCollection data or URL to fetch GeoJSON from */
  data: string | GeoJSON.FeatureCollection<GeoJSON.Point, P>;
  /** Maximum zoom level to cluster points on (default: 14) */
  clusterMaxZoom?: number;
  /** Radius of each cluster when clustering points in pixels (default: 50) */
  clusterRadius?: number;
  /** Colors for cluster circles: [small, medium, large] based on point count (default: ["#22c55e", "#eab308", "#ef4444"]) */
  clusterColors?: [string, string, string];
  /** Point count thresholds for color/size steps: [medium, large] (default: [100, 750]) */
  clusterThresholds?: [number, number];
  /** Color for unclustered individual points (default: "#3b82f6") */
  pointColor?: string;
  /** Callback when an unclustered point is clicked */
  onPointClick?: (
    feature: GeoJSON.Feature<GeoJSON.Point, P>,
    coordinates: [number, number],
  ) => void;
  /** Callback when a cluster is clicked. If not provided, zooms into the cluster */
  onClusterClick?: (
    clusterId: number,
    coordinates: [number, number],
    pointCount: number,
  ) => void;
};

function MapClusterLayer<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
>({
  data,
  clusterMaxZoom = 14,
  clusterRadius = 50,
  clusterColors = ["#22c55e", "#eab308", "#ef4444"],
  clusterThresholds = [100, 750],
  pointColor = "#3b82f6",
  onPointClick,
  onClusterClick,
}: MapClusterLayerProps<P>) {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `cluster-source-${id}`;
  const clusterLayerId = `clusters-${id}`;
  const clusterCountLayerId = `cluster-count-${id}`;
  const unclusteredLayerId = `unclustered-point-${id}`;

  const stylePropsRef = useRef({
    clusterColors,
    clusterThresholds,
    pointColor,
  });

  // Add source and layers on mount
  useEffect(() => {
    if (!isLoaded || !map) return;

    // Add clustered GeoJSON source
    map.addSource(sourceId, {
      type: "geojson",
      data,
      cluster: true,
      clusterMaxZoom,
      clusterRadius,
    });

    // Add cluster circles layer
    map.addLayer({
      id: clusterLayerId,
      type: "circle",
      source: sourceId,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          clusterColors[0],
          clusterThresholds[0],
          clusterColors[1],
          clusterThresholds[1],
          clusterColors[2],
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          20,
          clusterThresholds[0],
          30,
          clusterThresholds[1],
          40,
        ],
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
        "circle-opacity": 0.85,
      },
    });

    // Add cluster count text layer
    map.addLayer({
      id: clusterCountLayerId,
      type: "symbol",
      source: sourceId,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["Open Sans"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#fff",
      },
    });

    // Add unclustered point layer
    map.addLayer({
      id: unclusteredLayerId,
      type: "circle",
      source: sourceId,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": pointColor,
        "circle-radius": 5,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    return () => {
      try {
        if (map.getLayer(clusterCountLayerId))
          map.removeLayer(clusterCountLayerId);
        if (map.getLayer(unclusteredLayerId))
          map.removeLayer(unclusteredLayerId);
        if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map, sourceId]);

  // Update source data when data prop changes (only for non-URL data)
  useEffect(() => {
    if (!isLoaded || !map || typeof data === "string") return;

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
    if (source) {
      source.setData(data);
    }
  }, [isLoaded, map, data, sourceId]);

  // Update layer styles when props change
  useEffect(() => {
    if (!isLoaded || !map) return;

    const prev = stylePropsRef.current;
    const colorsChanged =
      prev.clusterColors !== clusterColors ||
      prev.clusterThresholds !== clusterThresholds;

    // Update cluster layer colors and sizes
    if (map.getLayer(clusterLayerId) && colorsChanged) {
      map.setPaintProperty(clusterLayerId, "circle-color", [
        "step",
        ["get", "point_count"],
        clusterColors[0],
        clusterThresholds[0],
        clusterColors[1],
        clusterThresholds[1],
        clusterColors[2],
      ]);
      map.setPaintProperty(clusterLayerId, "circle-radius", [
        "step",
        ["get", "point_count"],
        20,
        clusterThresholds[0],
        30,
        clusterThresholds[1],
        40,
      ]);
    }

    // Update unclustered point layer color
    if (map.getLayer(unclusteredLayerId) && prev.pointColor !== pointColor) {
      map.setPaintProperty(unclusteredLayerId, "circle-color", pointColor);
    }

    stylePropsRef.current = { clusterColors, clusterThresholds, pointColor };
  }, [
    isLoaded,
    map,
    clusterLayerId,
    unclusteredLayerId,
    clusterColors,
    clusterThresholds,
    pointColor,
  ]);

  // Handle click events
  useEffect(() => {
    if (!isLoaded || !map) return;

    // Cluster click handler - zoom into cluster
    const handleClusterClick = async (
      e: MapLibreGL.MapMouseEvent & {
        features?: MapLibreGL.MapGeoJSONFeature[];
      },
    ) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [clusterLayerId],
      });
      if (!features.length) return;

      const feature = features[0];
      const clusterId = feature.properties?.cluster_id as number;
      const pointCount = feature.properties?.point_count as number;
      const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number,
      ];

      if (onClusterClick) {
        onClusterClick(clusterId, coordinates, pointCount);
      } else {
        // Default behavior: zoom to cluster expansion zoom
        const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({
          center: coordinates,
          zoom,
        });
      }
    };

    // Unclustered point click handler
    const handlePointClick = (
      e: MapLibreGL.MapMouseEvent & {
        features?: MapLibreGL.MapGeoJSONFeature[];
      },
    ) => {
      if (!onPointClick || !e.features?.length) return;

      const feature = e.features[0];
      const coordinates = (
        feature.geometry as GeoJSON.Point
      ).coordinates.slice() as [number, number];

      // Handle world copies
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      onPointClick(
        feature as unknown as GeoJSON.Feature<GeoJSON.Point, P>,
        coordinates,
      );
    };

    // Cursor style handlers
    const handleMouseEnterCluster = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeaveCluster = () => {
      map.getCanvas().style.cursor = "";
    };
    const handleMouseEnterPoint = () => {
      if (onPointClick) {
        map.getCanvas().style.cursor = "pointer";
      }
    };
    const handleMouseLeavePoint = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", clusterLayerId, handleClusterClick);
    map.on("click", unclusteredLayerId, handlePointClick);
    map.on("mouseenter", clusterLayerId, handleMouseEnterCluster);
    map.on("mouseleave", clusterLayerId, handleMouseLeaveCluster);
    map.on("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
    map.on("mouseleave", unclusteredLayerId, handleMouseLeavePoint);

    return () => {
      map.off("click", clusterLayerId, handleClusterClick);
      map.off("click", unclusteredLayerId, handlePointClick);
      map.off("mouseenter", clusterLayerId, handleMouseEnterCluster);
      map.off("mouseleave", clusterLayerId, handleMouseLeaveCluster);
      map.off("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
      map.off("mouseleave", unclusteredLayerId, handleMouseLeavePoint);
    };
  }, [
    isLoaded,
    map,
    clusterLayerId,
    unclusteredLayerId,
    sourceId,
    onClusterClick,
    onPointClick,
  ]);

  return null;
}

/** Information about an airport */
export type AirportInfo = {
  /** IATA airport code (e.g. "TPE") */
  code: string;
  /** Full airport name */
  name: string;
  /** City name */
  city: string;
  /** Country name */
  country: string;
  /** Latitude in degrees */
  latitude: number;
  /** Longitude in degrees */
  longitude: number;
};

/** Reference to an airport: either an IATA code string or [longitude, latitude] tuple */
export type AirportRef = string | [number, number];

// Base reduzida aos aeroportos brasileiros (ver nota no topo do arquivo).
// prettier-ignore
export const airports: Record<string, AirportInfo> = {
  BEL: { code: "BEL", name: "Val de Cans/Júlio Cezar Ribeiro International Airport", city: "Belém", country: "Brazil", latitude: -1.3793, longitude: -48.4762 },
  BSB: { code: "BSB", name: "Presidente Juscelino Kubitschek International Airport", city: "Brasília", country: "Brazil", latitude: -15.8692, longitude: -47.9208 },
  BVB: { code: "BVB", name: "Atlas Brasil Cantanhede International Airport", city: "Boa Vista", country: "Brazil", latitude: 2.8462, longitude: -60.6906 },
  CNF: { code: "CNF", name: "Tancredo Neves International Airport", city: "Belo Horizonte", country: "Brazil", latitude: -19.6357, longitude: -43.9669 },
  CWB: { code: "CWB", name: "Curitiba-Afonso Pena International Airport", city: "Curitiba", country: "Brazil", latitude: -25.5285, longitude: -49.1758 },
  CGB: { code: "CGB", name: "Várzea Grande–Marechal Rondon International Airport", city: "Cuiabá", country: "Brazil", latitude: -15.6529, longitude: -56.1167 },
  MAO: { code: "MAO", name: "Eduardo Gomes International Airport", city: "Manaus", country: "Brazil", latitude: -3.0386, longitude: -60.0497 },
  IGU: { code: "IGU", name: "Cataratas International Airport", city: "Foz do Iguaçu", country: "Brazil", latitude: -25.5942, longitude: -54.4894 },
  FLN: { code: "FLN", name: "Hercílio Luz International Airport", city: "Florianópolis", country: "Brazil", latitude: -27.6703, longitude: -48.5525 },
  FOR: { code: "FOR", name: "Pinto Martins International Airport", city: "Fortaleza", country: "Brazil", latitude: -3.7758, longitude: -38.5322 },
  GIG: { code: "GIG", name: "Rio Galeão – Tom Jobim International Airport", city: "Rio De Janeiro", country: "Brazil", latitude: -22.81, longitude: -43.2506 },
  GYN: { code: "GYN", name: "Santa Genoveva International Airport", city: "Goiânia", country: "Brazil", latitude: -16.632, longitude: -49.2207 },
  GRU: { code: "GRU", name: "São Paulo/Guarulhos–Governor André Franco Montoro International Airport", city: "São Paulo", country: "Brazil", latitude: -23.4313, longitude: -46.47 },
  JPA: { code: "JPA", name: "Presidente Castro Pinto International Airport", city: "João Pessoa", country: "Brazil", latitude: -7.1487, longitude: -34.9506 },
  VCP: { code: "VCP", name: "Viracopos International Airport", city: "Campinas", country: "Brazil", latitude: -23.0074, longitude: -47.1345 },
  MCZ: { code: "MCZ", name: "Zumbi dos Palmares International Airport", city: "Maceió", country: "Brazil", latitude: -9.5126, longitude: -35.7918 },
  NVT: { code: "NVT", name: "Ministro Victor Konder International Airport", city: "Navegantes", country: "Brazil", latitude: -26.8794, longitude: -48.651 },
  POA: { code: "POA", name: "Porto Alegre-Salgado Filho International Airport", city: "Porto Alegre", country: "Brazil", latitude: -29.994, longitude: -51.1675 },
  BPS: { code: "BPS", name: "Porto Seguro International Airport", city: "Porto Seguro", country: "Brazil", latitude: -16.4384, longitude: -39.0806 },
  PVH: { code: "PVH", name: "Governador Jorge Teixeira de Oliveira International Airport", city: "Porto Velho", country: "Brazil", latitude: -8.7085, longitude: -63.9023 },
  RBR: { code: "RBR", name: "Rio Branco-Plácido de Castro International Airport", city: "Rio Branco", country: "Brazil", latitude: -9.869, longitude: -67.894 },
  REC: { code: "REC", name: "Recife/Guararapes - Gilberto Freyre International Airport", city: "Recife", country: "Brazil", latitude: -8.1275, longitude: -34.923 },
  SDU: { code: "SDU", name: "Santos Dumont Airport", city: "Rio de Janeiro", country: "Brazil", latitude: -22.9104, longitude: -43.1628 },
  NAT: { code: "NAT", name: "Rio Grande do Norte/São Gonçalo do Amarante–Governador Aluízio Alves International Airport", city: "Natal", country: "Brazil", latitude: -5.7698, longitude: -35.3666 },
  SLZ: { code: "SLZ", name: "Marechal Cunha Machado International Airport", city: "São Luís", country: "Brazil", latitude: -2.5864, longitude: -44.235 },
  CGH: { code: "CGH", name: "Congonhas–Deputado Freitas Nobre Airport", city: "São Paulo", country: "Brazil", latitude: -23.6277, longitude: -46.6546 },
  SSA: { code: "SSA", name: "Deputado Luiz Eduardo Magalhães International Airport", city: "Salvador", country: "Brazil", latitude: -12.9086, longitude: -38.3225 },
  VIX: { code: "VIX", name: "Eurico de Aguiar Salles International Airport", city: "Vitória", country: "Brazil", latitude: -20.258, longitude: -40.285 },
};

/**
 * Resolve an airport reference to [longitude, latitude] coordinates.
 * Accepts either an IATA code string or a [lng, lat] tuple.
 */
function resolveAirport(ref: AirportRef): [number, number] {
  if (Array.isArray(ref)) return ref;
  const airport = airports[ref.toUpperCase()];
  if (!airport) {
    throw new Error(
      `Unknown airport code: "${ref}". Use a valid IATA code or pass [longitude, latitude] directly.`,
    );
  }
  return [airport.longitude, airport.latitude];
}

/**
 * Look up full airport info by IATA code.
 * Returns undefined if the code is not found.
 */
function getAirportInfo(code: string): AirportInfo | undefined {
  return airports[code.toUpperCase()];
}

type FlightMapTheme = "light" | "dark";

function getFlightDocumentTheme(): FlightMapTheme | null {
  if (typeof document === "undefined") return null;
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return null;
}

function getFlightSystemTheme(): FlightMapTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Resolves light/dark the same way as Map’s basemap: `html` class (e.g. next-themes)
 * or `prefers-color-scheme` when unset.
 */
function useFlightMapTheme(): FlightMapTheme {
  const [theme, setTheme] = useState<FlightMapTheme>(
    () => getFlightDocumentTheme() ?? getFlightSystemTheme(),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const docTheme = getFlightDocumentTheme();
      if (docTheme) setTheme(docTheme);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = (e: MediaQueryListEvent) => {
      if (!getFlightDocumentTheme()) setTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", onSystem);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", onSystem);
    };
  }, []);

  return theme;
}

/** Default arc stroke on light basemap when `color` is omitted */
const FLIGHT_ROUTE_COLOR_LIGHT = "#0a0a0a";
/** Default arc stroke on dark basemap when `color` is omitted */
const FLIGHT_ROUTE_COLOR_DARK = "#e8e8e8";

function normalizeAirportRefKey(ref: AirportRef): string {
  if (typeof ref === "string") {
    return `code:${ref.toUpperCase()}`;
  }
  return `coord:${ref[0].toFixed(6)},${ref[1].toFixed(6)}`;
}

function safeResolveAirport(refKey: string): [number, number] | null {
  try {
    if (refKey.startsWith("code:")) {
      return resolveAirport(refKey.slice(5));
    }

    const coordinates = refKey.slice(6).split(",");
    if (coordinates.length !== 2) {
      throw new Error(`Invalid airport coordinate key: "${refKey}"`);
    }

    const longitude = Number(coordinates[0]);
    const latitude = Number(coordinates[1]);
    if (Number.isNaN(longitude) || Number.isNaN(latitude)) {
      throw new Error(`Invalid airport coordinate key: "${refKey}"`);
    }

    return [longitude, latitude];
  } catch (error) {
    console.warn(error);
    return null;
  }
}

type AirportMarkerDedupEntry = {
  ownerId: string;
  markerIds: Set<string>;
};

const airportMarkerDedupStores = new WeakMap<
  MapLibreGL.Map,
  globalThis.Map<string, AirportMarkerDedupEntry>
>();
const airportMarkerDedupListeners = new WeakMap<
  MapLibreGL.Map,
  Set<() => void>
>();

function getAirportMarkerDedupStore(map: MapLibreGL.Map) {
  let store = airportMarkerDedupStores.get(map);
  if (!store) {
    store = new globalThis.globalThis.Map<string, AirportMarkerDedupEntry>();
    airportMarkerDedupStores.set(map, store);
  }
  return store;
}

function getAirportMarkerDedupListeners(map: MapLibreGL.Map) {
  let listeners = airportMarkerDedupListeners.get(map);
  if (!listeners) {
    listeners = new Set<() => void>();
    airportMarkerDedupListeners.set(map, listeners);
  }
  return listeners;
}

function notifyAirportMarkerDedupListeners(map: MapLibreGL.Map) {
  getAirportMarkerDedupListeners(map).forEach((listener) => listener());
}

function subscribeAirportMarkerDedup(
  map: MapLibreGL.Map | null,
  listener: () => void,
) {
  if (!map) return () => {};

  const listeners = getAirportMarkerDedupListeners(map);
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getAirportMarkerOwnerId(
  map: MapLibreGL.Map | null,
  dedupeKey: string,
) {
  if (!map) return null;
  return getAirportMarkerDedupStore(map).get(dedupeKey)?.ownerId ?? null;
}

function claimAirportMarker(
  map: MapLibreGL.Map | null,
  dedupeKey: string,
  markerId: string,
) {
  if (!map) return () => {};

  const store = getAirportMarkerDedupStore(map);
  const existing = store.get(dedupeKey);

  if (!existing) {
    store.set(dedupeKey, {
      ownerId: markerId,
      markerIds: new Set([markerId]),
    });
  } else {
    existing.markerIds.add(markerId);
  }

  notifyAirportMarkerDedupListeners(map);

  return () => {
    const entry = store.get(dedupeKey);
    if (!entry) return;

    entry.markerIds.delete(markerId);

    if (entry.markerIds.size === 0) {
      store.delete(dedupeKey);
    } else if (entry.ownerId === markerId) {
      entry.ownerId = entry.markerIds.values().next().value as string;
    }

    notifyAirportMarkerDedupListeners(map);
  };
}

function useAirportMarkerVisibility(
  map: MapLibreGL.Map | null,
  dedupeKey?: string,
): boolean {
  const markerId = useId();
  const ownerId = useSyncExternalStore(
    useCallback(
      (onStoreChange) => subscribeAirportMarkerDedup(map, onStoreChange),
      [map],
    ),
    () => (dedupeKey ? getAirportMarkerOwnerId(map, dedupeKey) : null),
    () => null,
  );

  useEffect(() => {
    if (!dedupeKey) return;
    return claimAirportMarker(map, dedupeKey, markerId);
  }, [map, dedupeKey, markerId]);

  if (!dedupeKey) return true;
  return ownerId === markerId;
}

/** GeoJSON geometry for an arc — either a single line or multiple segments (antimeridian crossing) */
type ArcGeometry =
  | { type: "LineString"; coordinates: [number, number][] }
  | { type: "MultiLineString"; coordinates: [number, number][][] };

/**
 * Generate great circle arc geometry between two points.
 * Returns a GeoJSON geometry object (LineString or MultiLineString).
 * MultiLineString is returned when the route crosses the antimeridian (180°).
 */
function generateArcGeometry(
  from: [number, number],
  to: [number, number],
  npoints: number = 100,
): ArcGeometry {
  // Handle identical points or very short distances
  if (
    (from[0] === to[0] && from[1] === to[1]) ||
    (Math.abs(from[0] - to[0]) < 0.01 && Math.abs(from[1] - to[1]) < 0.01)
  ) {
    return { type: "LineString", coordinates: [from, to] };
  }

  try {
    const arc = greatCircle(from, to, { npoints });
    const geometry = arc.geometry;

    // greatCircle returns MultiLineString for routes crossing the antimeridian.
    // We preserve the type so MapLibre renders the gap correctly instead of
    // drawing a straight line across the entire map.
    if (geometry.type === "MultiLineString") {
      return {
        type: "MultiLineString",
        coordinates: geometry.coordinates as [number, number][][],
      };
    }

    return {
      type: "LineString",
      coordinates: geometry.coordinates as [number, number][],
    };
  } catch {
    return { type: "LineString", coordinates: [from, to] };
  }
}

/**
 * Generate great circle arc coordinates between two points.
 * Returns a flat array of [longitude, latitude] tuples.
 * For routes crossing the antimeridian, longitudes are unwrapped to ensure
 * continuity (values may exceed ±180°) so that linear interpolation produces
 * correct intermediate positions instead of jumping across the map.
 */
function generateArcCoordinates(
  from: [number, number],
  to: [number, number],
  npoints: number = 100,
): [number, number][] {
  const geom = generateArcGeometry(from, to, npoints);
  return unwrapArcCoordinates(geom);
}

/**
 * Flatten an arc geometry into a continuous coordinate list,
 * unwrapping longitudes across the antimeridian.
 */
function unwrapArcCoordinates(geometry: ArcGeometry): [number, number][] {
  if (geometry.type === "LineString") {
    return geometry.coordinates;
  }

  // Unwrap longitudes to ensure continuity across the antimeridian.
  // Without unwrapping, linear interpolation between segments ending at ~180°
  // and starting at ~-180° would incorrectly traverse through 0°.
  const result: [number, number][] = [];
  for (const segment of geometry.coordinates) {
    for (const coord of segment) {
      if (result.length === 0) {
        result.push([coord[0], coord[1]]);
        continue;
      }

      const prev = result[result.length - 1];
      let lng = coord[0];
      while (lng - prev[0] > 180) lng -= 360;
      while (lng - prev[0] < -180) lng += 360;
      result.push([lng, coord[1]]);
    }
  }

  return result;
}

/**
 * Normalize route geometry for the active projection.
 * Mercator keeps the dateline split to avoid drawing a line across the full map.
 * Globe should use one continuous line so the antimeridian seam does not show as a gap.
 */
function resolveArcGeometryForProjection(
  geometry: ArcGeometry,
  projectionType: string | null,
): ArcGeometry {
  if (projectionType !== "globe" || geometry.type === "LineString") {
    return geometry;
  }

  return {
    type: "LineString",
    coordinates: unwrapArcCoordinates(geometry),
  };
}

function getProjectionType(
  map: MapLibreGL.Map | null | undefined,
): string | null {
  const projection = map?.getProjection();
  return typeof projection?.type === "string" ? projection.type : null;
}

/**
 * Compute the great-circle distance (in km) between two [lng, lat] points
 * using the Haversine formula. Used for route distance calculation and
 * to weight multi-leg animation durations proportionally.
 */
function haversineDistance(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * sinLng * sinLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

type FlightAirportProps = {
  /** IATA airport code (e.g. "TPE", "NRT") — mutually exclusive with longitude/latitude */
  code?: string;
  /** Longitude — use with latitude for custom coordinates */
  longitude?: number;
  /** Latitude — use with longitude for custom coordinates */
  latitude?: number;
  /** Display name override. When using code, auto-resolved from database. */
  name?: string;
  /** Whether to show the airport code/name label (default: false) */
  showLabel?: boolean;
  /** Label position relative to the marker (default: "top") */
  labelPosition?: "top" | "bottom";
  /** Additional CSS classes for the label */
  labelClassName?: string;
  /** Additional CSS classes for the MarkerContent container */
  className?: string;
  /**
   * Custom marker content. When provided, replaces the default black dot marker.
   * Accepts any ReactNode — use mapcn's marker patterns:
   *
   * - Colored dot: `<div className="size-4 rounded-full bg-red-500 border-2 border-white shadow-lg" />`
   * - Icon in circle: `<div className="bg-emerald-500 rounded-full p-1.5 shadow-lg"><Plane className="size-3 text-white" /></div>`
   * - Numbered: `<div className="size-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-semibold">1</div>`
   * - Pulsing: `<div className="relative flex items-center justify-center"><div className="absolute size-6 rounded-full bg-cyan-500/20 animate-ping" /><div className="size-4 rounded-full bg-cyan-500 border-2 border-white shadow-lg" /></div>`
   *
   * When omitted, uses a theme-aware dot (h-4 w-4) for contrast on light/dark maps.
   */
  markerContent?: ReactNode;
  /** Callback when the airport marker is clicked */
  onClick?: (
    airport: AirportInfo | { longitude: number; latitude: number },
  ) => void;
  /** Optional deduplication key to suppress duplicate markers rendered at the same airport */
  dedupeKey?: string;
  /** Custom content to render inside the marker popup (shown on click) */
  children?: ReactNode;
};

function FlightAirport({
  code,
  longitude: lngProp,
  latitude: latProp,
  name: nameProp,
  showLabel = false,
  labelPosition = "top",
  labelClassName,
  className,
  markerContent,
  onClick,
  dedupeKey,
  children,
}: FlightAirportProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { map } = useMap();
  const flightMapTheme = useFlightMapTheme();
  const isVisible = useAirportMarkerVisibility(map, dedupeKey);

  // Resolve coordinates
  const airportInfo = code ? getAirportInfo(code) : undefined;
  const lng = lngProp ?? airportInfo?.longitude;
  const lat = latProp ?? airportInfo?.latitude;
  const displayName = nameProp ?? (airportInfo ? airportInfo.code : undefined);

  if (lng === undefined || lat === undefined) {
    if (code) {
      console.warn(`FlightAirport: Unknown airport code "${code}"`);
    } else {
      console.warn(
        "FlightAirport: Either code or longitude/latitude must be provided",
      );
    }
    return null;
  }

  if (!isVisible) return null;

  const handleClick = () => {
    if (onClick) {
      onClick(airportInfo ?? { longitude: lng, latitude: lat });
    }
    if (children) {
      setIsPopupOpen(!isPopupOpen);
    }
  };

  return (
    <MapMarker longitude={lng} latitude={lat} onClick={handleClick}>
      {/* When markerContent is provided, it replaces the default theme-aware dot */}
      <MarkerContent className={className}>
        {markerContent || (
          <div
            className={cn(
              "relative h-4 w-4 rounded-full border-2 shadow-lg",
              flightMapTheme === "dark"
                ? "border-neutral-700 bg-neutral-100"
                : "border-white bg-neutral-950",
            )}
          />
        )}
        {showLabel && displayName && (
          <MarkerLabel
            position={labelPosition}
            className={cn(
              flightMapTheme === "dark"
                ? "text-neutral-100"
                : "text-neutral-950",
              labelClassName,
            )}
          >
            {displayName}
          </MarkerLabel>
        )}
      </MarkerContent>
      {children && isPopupOpen && (
        <MapPopup
          longitude={lng}
          latitude={lat}
          onClose={() => setIsPopupOpen(false)}
          closeOnClick={false}
          closeButton
        >
          {children}
        </MapPopup>
      )}
    </MapMarker>
  );
}

/** Animation configuration for FlightRoute */
type FlightRouteAnimateConfig = {
  /**
   * Animation duration in milliseconds (default: 4000).
   * Ignored when `progress` is provided (controlled mode).
   */
  duration?: number;
  /**
   * Manual progress value from 0 to 1. When provided, the component
   * switches to controlled mode — no internal animation runs, and the
   * airplane position is derived entirely from this value.
   */
  progress?: number;
  /**
   * Whether the animation loops continuously (default: true).
   * When false, the airplane disappears after reaching the destination.
   */
  loop?: boolean;
  /**
   * Whether the airplane flies back to the origin after reaching the
   * destination, creating a continuous round-trip animation (default: false).
   * The total cycle time equals `duration` (half outbound, half return).
   */
  roundTrip?: boolean;
  /**
   * Custom airplane icon. Defaults to a built-in plane SVG.
   * The icon is auto-rotated via MapLibre `setRotation` to face the
   * direction of travel. Design your icon pointing **up (↑ / north)**
   * for correct alignment.
   */
  icon?: ReactNode;
  /** CSS class applied to the airplane icon wrapper */
  iconClassName?: string;
  /** Airplane icon size in pixels (default: 24) */
  iconSize?: number;
  /** Callback fired on every animation frame with current progress (0-1) */
  onProgress?: (progress: number) => void;
  /** Callback fired when the animation completes one full cycle */
  onComplete?: () => void;
};

type FlightRouteProps = {
  /** Origin airport: IATA code or [longitude, latitude] */
  from: AirportRef;
  /** Destination airport: IATA code or [longitude, latitude] */
  to: AirportRef;
  /** Optional unique identifier for this route layer */
  id?: string;
  /**
   * Route line color. When omitted, picks a contrast color for the active map
   * theme (same rules as Map basemap: `html` class or system preference).
   */
  color?: string;
  /** Route line width in pixels (default: 2) */
  width?: number;
  /** Route line opacity from 0 to 1 (default: 0.7) */
  opacity?: number;
  /**
   * Line style preset (default: "solid")
   * - "solid": continuous line
   * - "dash": dashed line (— — —)
   * - "dot": dotted line (· · ·)
   */
  lineStyle?: "solid" | "dash" | "dot";
  /** Number of points to interpolate along the arc (default: 100) */
  npoints?: number;
  /** Whether to render the origin/destination airport markers (default: false) */
  showAirports?: boolean;
  /** Whether to show the airport code label on markers (default: false). Only effective when showAirports is true. */
  showLabel?: boolean;
  /** Additional CSS classes for the airport label */
  labelClassName?: string;
  /**
   * Custom marker content for auto-rendered airport markers.
   * See FlightAirportProps.markerContent for examples.
   */
  markerContent?: ReactNode;
  /** Callback when the route line is clicked */
  onClick?: () => void;
  /** Callback when mouse enters the route line */
  onMouseEnter?: () => void;
  /** Callback when mouse leaves the route line */
  onMouseLeave?: () => void;
  /** Whether the route is interactive (default: true) */
  interactive?: boolean;
  /**
   * Enable flight animation along the route.
   * - `true`: animate with default settings
   * - `FlightRouteAnimateConfig`: animate with custom settings
   * - `false` / `undefined`: no animation (static route)
   */
  animate?: boolean | FlightRouteAnimateConfig;
  /**
   * Whether to show hover effect on the route line (default: true).
   * When enabled, hovering over the route line will:
   * - Thicken the line for visual feedback
   * - Show a tooltip with route information (origin, destination, distance,
   *   estimated flight time, and trip type)
   */
  hoverEffect?: boolean;
  /**
   * Trip type for this route (default: "one-way").
   * - "one-way": one-directional flight, tooltip shows →
   * - "round-trip": bidirectional flight, tooltip shows ↔,
   *   and animation automatically uses roundTrip mode
   */
  tripType?: "one-way" | "round-trip";
};

/** Resolve lineStyle preset to a dash array value */
function resolveDashArray(
  lineStyle?: "solid" | "dash" | "dot",
): [number, number] | undefined {
  switch (lineStyle) {
    case "dash":
      return [4, 3];
    case "dot":
      return [1, 2];
    default:
      return undefined;
  }
}

type RouteHoverInfo = {
  fromLabel: string;
  toLabel: string;
  distanceKm: number;
  estimatedHours: number;
  estimatedMinutes: number;
  tripType: string;
  isRoundTrip: boolean;
};

/** Build HTML content for the route hover tooltip using Tailwind classes only */
function buildRouteTooltipHTML(info: RouteHoverInfo): string {
  const distance = info.distanceKm.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
  const time =
    info.estimatedHours > 0
      ? `~${info.estimatedHours}h ${info.estimatedMinutes}m`
      : `~${info.estimatedMinutes}m`;
  const arrow = info.isRoundTrip ? "&harr;" : "&rarr;";

  return `<div class="pointer-events-none min-w-[180px] rounded-md border border-border bg-popover px-3.5 py-2.5 text-xs leading-relaxed text-popover-foreground shadow-md">
  <p class="mb-1 text-xs font-semibold">${info.fromLabel} ${arrow} ${info.toLabel}</p>
  <div class="mt-1 border-t border-border pt-1.5">
    <div class="flex items-center justify-between gap-4"><span class="text-muted-foreground">Distance</span><span>${distance} km</span></div>
    <div class="flex items-center justify-between gap-4"><span class="text-muted-foreground">Est. Time</span><span>${time}</span></div>
    <div class="flex items-center justify-between gap-4"><span class="text-muted-foreground">Type</span><span>${info.tripType}</span></div>
  </div>
</div>`;
}

/** Compute hover info for a flight route */
function computeRouteHoverInfo(
  from: AirportRef,
  to: AirportRef,
  fromCoords: [number, number],
  toCoords: [number, number],
  tripType?: "one-way" | "round-trip",
): RouteHoverInfo {
  const fromInfo = typeof from === "string" ? getAirportInfo(from) : null;
  const toInfo = typeof to === "string" ? getAirportInfo(to) : null;

  const fromLabel = fromInfo
    ? `${fromInfo.city} (${fromInfo.code})`
    : `${fromCoords[1].toFixed(2)}°, ${fromCoords[0].toFixed(2)}°`;
  const toLabel = toInfo
    ? `${toInfo.city} (${toInfo.code})`
    : `${toCoords[1].toFixed(2)}°, ${toCoords[0].toFixed(2)}°`;

  const distanceKm = haversineDistance(fromCoords, toCoords);
  const avgSpeed = 850; // km/h approximate cruising speed
  const totalMinutes = Math.round((distanceKm / avgSpeed) * 60);
  const estimatedHours = Math.floor(totalMinutes / 60);
  const estimatedMinutes = totalMinutes % 60;

  const isRoundTrip = tripType === "round-trip";

  return {
    fromLabel,
    toLabel,
    distanceKm,
    estimatedHours,
    estimatedMinutes,
    tripType: isRoundTrip ? "Round Trip" : "One-way",
    isRoundTrip,
  };
}

function FlightRoute({
  from,
  to,
  id: propId,
  color,
  width = 2,
  opacity = 0.7,
  lineStyle = "solid",
  npoints = 100,
  showAirports = false,
  showLabel = false,
  labelClassName,
  markerContent,
  onClick,
  onMouseEnter,
  onMouseLeave,
  interactive = true,
  animate,
  hoverEffect = true,
  tripType,
}: FlightRouteProps) {
  const { map, isLoaded } = useMap();
  const flightMapTheme = useFlightMapTheme();
  const resolvedRouteColor =
    color ??
    (flightMapTheme === "dark"
      ? FLIGHT_ROUTE_COLOR_DARK
      : FLIGHT_ROUTE_COLOR_LIGHT);
  const autoId = useId();
  const id = propId ?? autoId;
  const sourceId = `flight-route-source-${id}`;
  const layerId = `flight-route-layer-${id}`;
  const projectionType = useSyncExternalStore<string | null>(
    useCallback(
      (onStoreChange) => {
        if (!map) return () => {};

        map.on("projectiontransition", onStoreChange);
        map.on("styledata", onStoreChange);

        return () => {
          map.off("projectiontransition", onStoreChange);
          map.off("styledata", onStoreChange);
        };
      },
      [map],
    ),
    () => getProjectionType(map),
    () => null,
  );

  // Normalize animate prop — auto-inject roundTrip from tripType
  const animateConfig = useMemo<FlightRouteAnimateConfig | null>(() => {
    if (!animate) return null;
    const base: FlightRouteAnimateConfig =
      animate === true ? {} : { ...animate };
    // tripType drives roundTrip unless explicitly overridden in animate config
    if (tripType === "round-trip" && base.roundTrip === undefined) {
      base.roundTrip = true;
    }
    return base;
  }, [animate, tripType]);

  // Resolve dash array from lineStyle preset
  const resolvedDash = useMemo(() => resolveDashArray(lineStyle), [lineStyle]);

  // Resolve coordinates — use value-based keys to avoid unnecessary recalculation
  // when coordinate arrays are recreated with the same values on parent re-renders
  const fromKey = normalizeAirportRefKey(from);
  const fromCoords = useMemo(() => safeResolveAirport(fromKey), [fromKey]);

  const toKey = normalizeAirportRefKey(to);
  const toCoords = useMemo(() => safeResolveAirport(toKey), [toKey]);

  const fromDedupeKey = fromKey;
  const toDedupeKey = toKey;

  // Generate the base arc geometry before projection-specific normalization.
  const arcGeometry = useMemo(() => {
    if (!fromCoords || !toCoords) return null;
    return generateArcGeometry(fromCoords, toCoords, npoints);
  }, [fromCoords, toCoords, npoints]);
  const renderedArcGeometry = useMemo(() => {
    if (!arcGeometry) return null;
    return resolveArcGeometryForProjection(arcGeometry, projectionType);
  }, [arcGeometry, projectionType]);

  // Store callbacks in refs to avoid effect re-runs
  const onClickRef = useRef(onClick);
  const onMouseEnterRef = useRef(onMouseEnter);
  const onMouseLeaveRef = useRef(onMouseLeave);
  useEffect(() => {
    onClickRef.current = onClick;
    onMouseEnterRef.current = onMouseEnter;
    onMouseLeaveRef.current = onMouseLeave;
  });

  // Compute route info for hover tooltip
  const routeInfo = useMemo<RouteHoverInfo | null>(() => {
    if (!fromCoords || !toCoords) return null;
    return computeRouteHoverInfo(from, to, fromCoords, toCoords, tripType);
  }, [fromCoords, toCoords, from, to, tripType]);

  // Store mutable values in refs so the hover effect doesn't need to re-attach
  const widthRef = useRef(width);
  const opacityRef = useRef(opacity);
  const routeInfoRef = useRef(routeInfo);
  const hoverEffectRef = useRef(hoverEffect);
  useEffect(() => {
    widthRef.current = width;
    opacityRef.current = opacity;
    routeInfoRef.current = routeInfo;
    hoverEffectRef.current = hoverEffect;
  });

  // Add source and layer on mount
  useEffect(() => {
    if (!isLoaded || !map) return;

    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: [] },
      },
    });

    const paint: Record<string, unknown> = {
      "line-width": width,
      "line-opacity": opacity,
      "line-color": resolvedRouteColor,
    };

    if (resolvedDash) {
      paint["line-dasharray"] = resolvedDash;
    }

    map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: {
        "line-join": "round",
        "line-cap": resolvedDash ? "butt" : "round",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paint: paint as any,
    });

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  // Update coordinates when they change
  useEffect(() => {
    if (!isLoaded || !map || !renderedArcGeometry) return;

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
    if (source) {
      source.setData({
        type: "Feature",
        properties: {},
        geometry: renderedArcGeometry,
      });
    }
  }, [isLoaded, map, renderedArcGeometry, sourceId]);

  // Update paint properties when they change
  useEffect(() => {
    if (!isLoaded || !map || !map.getLayer(layerId)) return;

    map.setPaintProperty(layerId, "line-color", resolvedRouteColor);
    // maplibre-gl v6 não aceita `null` nos types — `undefined` limpa a propriedade
    map.setPaintProperty(layerId, "line-dasharray", resolvedDash ?? undefined);
    map.setPaintProperty(layerId, "line-width", width);
    map.setPaintProperty(layerId, "line-opacity", opacity);
    map.setLayoutProperty(layerId, "line-cap", resolvedDash ? "butt" : "round");
  }, [
    isLoaded,
    map,
    layerId,
    resolvedRouteColor,
    width,
    opacity,
    resolvedDash,
  ]);

  // Handle click and hover events (with hover effect: line thickening + tooltip)
  useEffect(() => {
    if (!isLoaded || !map || !interactive) return;

    // Create a reusable tooltip popup for this route
    const tooltip = new MapLibreGL.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
      className:
        "[&_.maplibregl-popup-content]:!rounded-none [&_.maplibregl-popup-content]:!bg-transparent [&_.maplibregl-popup-content]:!p-0 [&_.maplibregl-popup-content]:!shadow-none [&_.maplibregl-popup-tip]:!hidden",
    }).setMaxWidth("none");

    const handleClick = () => onClickRef.current?.();

    const handleMouseEnter = (e: MapLibreGL.MapLayerMouseEvent & object) => {
      map.getCanvas().style.cursor = "pointer";

      if (hoverEffectRef.current && map.getLayer(layerId)) {
        // Thicken the line
        map.setPaintProperty(
          layerId,
          "line-width",
          Math.max(widthRef.current * 2.5, widthRef.current + 2),
        );
        map.setPaintProperty(layerId, "line-opacity", 1);
      }

      // Show tooltip with route info
      const info = routeInfoRef.current;
      if (hoverEffectRef.current && info) {
        tooltip
          .setLngLat(e.lngLat)
          .setHTML(buildRouteTooltipHTML(info))
          .addTo(map);
      }

      onMouseEnterRef.current?.();
    };

    const handleMouseMove = (e: MapLibreGL.MapLayerMouseEvent & object) => {
      if (tooltip.isOpen()) {
        tooltip.setLngLat(e.lngLat);
      }
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";

      if (hoverEffectRef.current && map.getLayer(layerId)) {
        // Restore original line width and opacity
        map.setPaintProperty(layerId, "line-width", widthRef.current);
        map.setPaintProperty(layerId, "line-opacity", opacityRef.current);
      }

      // Hide tooltip
      tooltip.remove();

      onMouseLeaveRef.current?.();
    };

    map.on("click", layerId, handleClick);
    map.on("mouseenter", layerId, handleMouseEnter);
    map.on("mousemove", layerId, handleMouseMove);
    map.on("mouseleave", layerId, handleMouseLeave);

    return () => {
      map.off("click", layerId, handleClick);
      map.off("mouseenter", layerId, handleMouseEnter);
      map.off("mousemove", layerId, handleMouseMove);
      map.off("mouseleave", layerId, handleMouseLeave);
      tooltip.remove();
    };
  }, [isLoaded, map, layerId, interactive]);

  if (!fromCoords || !toCoords) return null;

  return (
    <>
      {showAirports && (
        <>
          {typeof from === "string" ? (
            <FlightAirport
              code={from}
              markerContent={markerContent}
              showLabel={showLabel}
              labelClassName={labelClassName}
              dedupeKey={fromDedupeKey}
            />
          ) : (
            <FlightAirport
              longitude={from[0]}
              latitude={from[1]}
              markerContent={markerContent}
              showLabel={false}
              dedupeKey={fromDedupeKey}
            />
          )}
          {typeof to === "string" ? (
            <FlightAirport
              code={to}
              markerContent={markerContent}
              showLabel={showLabel}
              labelClassName={labelClassName}
              dedupeKey={toDedupeKey}
            />
          ) : (
            <FlightAirport
              longitude={to[0]}
              latitude={to[1]}
              markerContent={markerContent}
              showLabel={false}
              dedupeKey={toDedupeKey}
            />
          )}
        </>
      )}
      {animateConfig && fromCoords && toCoords && (
        <FlightAnimationMarker
          fromCoords={fromCoords}
          toCoords={toCoords}
          npoints={npoints}
          config={animateConfig}
        />
      )}
    </>
  );
}

type FlightRouteData = {
  /** Origin airport: IATA code or [longitude, latitude] */
  from: AirportRef;
  /** Destination airport: IATA code or [longitude, latitude] */
  to: AirportRef;
  /** Route line color override */
  color?: string;
  /** Route line width override */
  width?: number;
  /** Route line opacity override */
  opacity?: number;
  /** Line style override: "solid", "dash", or "dot" */
  lineStyle?: "solid" | "dash" | "dot";
  /** Override hover effect for this specific route */
  hoverEffect?: boolean;
  /** Trip type for this specific route ("one-way" or "round-trip") */
  tripType?: "one-way" | "round-trip";
  /** Callback when this route line is clicked */
  onClick?: () => void;
  /** Callback when mouse enters this route line */
  onMouseEnter?: () => void;
  /** Callback when mouse leaves this route line */
  onMouseLeave?: () => void;
  /** Override interactive setting for this specific route */
  interactive?: boolean;
  /**
   * Animation override for this specific route.
   * - `true`: animate with default settings
   * - `FlightRouteAnimateConfig`: animate with custom settings
   * - `false`: disable animation for this route
   * - `undefined`: use the parent FlightRoutes default
   */
  animate?: boolean | FlightRouteAnimateConfig;
};

type FlightRoutesProps = {
  /** Array of route data */
  routes: readonly FlightRouteData[];
  /** Default route line color; when omitted, uses theme-aware stroke (see FlightRoute `color`). */
  color?: string;
  /** Default route line width (default: 2) */
  width?: number;
  /** Default route line opacity (default: 0.7) */
  opacity?: number;
  /**
   * Default line style for all routes (default: "solid")
   * - "solid": continuous line
   * - "dash": dashed line (— — —)
   * - "dot": dotted line (· · ·)
   */
  lineStyle?: "solid" | "dash" | "dot";
  /** Number of arc interpolation points per route (default: 100) */
  npoints?: number;
  /** Whether to render airport markers at all endpoints (default: false) */
  showAirports?: boolean;
  /** Whether to show the airport code label on markers (default: false). Only effective when showAirports is true. */
  showLabel?: boolean;
  /** Additional CSS classes for the airport label */
  labelClassName?: string;
  /**
   * Custom marker content for auto-rendered airport markers.
   * When provided, replaces the default black dot. See FlightAirportProps.markerContent for examples.
   */
  markerContent?: ReactNode;
  /** Whether routes are interactive (default: true) */
  interactive?: boolean;
  /** Whether to show hover effect on route lines (default: true) */
  hoverEffect?: boolean;
  /**
   * Default trip type for all routes (default: "one-way").
   * Can be overridden per-route in the route data.
   */
  tripType?: "one-way" | "round-trip";
  /**
   * Callback when any route line is clicked.
   * Receives the route index and the route data object.
   * Per-route `onClick` in `FlightRouteData` takes precedence when set.
   */
  onClick?: (routeIndex: number, route: FlightRouteData) => void;
  /**
   * Callback when mouse enters any route line.
   * Receives the route index and the route data object.
   * Per-route `onMouseEnter` in `FlightRouteData` takes precedence when set.
   */
  onMouseEnter?: (routeIndex: number, route: FlightRouteData) => void;
  /**
   * Callback when mouse leaves any route line.
   * Receives the route index and the route data object.
   * Per-route `onMouseLeave` in `FlightRouteData` takes precedence when set.
   */
  onMouseLeave?: (routeIndex: number, route: FlightRouteData) => void;
  /**
   * Enable flight animation for all routes.
   * - `true`: animate with default settings
   * - `FlightRouteAnimateConfig`: animate with custom settings
   * - `false` / `undefined`: no animation (static routes)
   */
  animate?: boolean | FlightRouteAnimateConfig;
};

function FlightRoutes({
  routes,
  color,
  width = 2,
  opacity = 0.7,
  lineStyle = "solid",
  npoints = 100,
  showAirports = false,
  showLabel = false,
  labelClassName,
  markerContent,
  interactive = true,
  hoverEffect = true,
  tripType = "one-way",
  onClick,
  onMouseEnter,
  onMouseLeave,
  animate,
}: FlightRoutesProps) {
  // Collect unique airports for rendering when showAirports is true
  const uniqueAirports = useMemo(() => {
    if (!showAirports) return [];
    const seen = new Set<string>();
    const result: AirportRef[] = [];

    for (const route of routes) {
      const fromKey =
        typeof route.from === "string" ? route.from : route.from.join(",");
      const toKey =
        typeof route.to === "string" ? route.to : route.to.join(",");

      if (!seen.has(fromKey)) {
        seen.add(fromKey);
        result.push(route.from);
      }
      if (!seen.has(toKey)) {
        seen.add(toKey);
        result.push(route.to);
      }
    }

    return result;
  }, [routes, showAirports]);

  return (
    <>
      {routes.map((route, index) => (
        <FlightRoute
          key={`${typeof route.from === "string" ? route.from : route.from.join(",")}-${typeof route.to === "string" ? route.to : route.to.join(",")}-${index}`}
          from={route.from}
          to={route.to}
          color={route.color ?? color}
          width={route.width ?? width}
          opacity={route.opacity ?? opacity}
          lineStyle={route.lineStyle ?? lineStyle}
          npoints={npoints}
          interactive={route.interactive ?? interactive}
          hoverEffect={route.hoverEffect ?? hoverEffect}
          tripType={route.tripType ?? tripType}
          animate={route.animate ?? animate}
          onClick={
            route.onClick ?? (onClick ? () => onClick(index, route) : undefined)
          }
          onMouseEnter={
            route.onMouseEnter ??
            (onMouseEnter ? () => onMouseEnter(index, route) : undefined)
          }
          onMouseLeave={
            route.onMouseLeave ??
            (onMouseLeave ? () => onMouseLeave(index, route) : undefined)
          }
          showAirports={false}
        />
      ))}
      {showAirports &&
        uniqueAirports.map((airport) =>
          typeof airport === "string" ? (
            <FlightAirport
              key={airport}
              code={airport}
              markerContent={markerContent}
              showLabel={showLabel}
              labelClassName={labelClassName}
              dedupeKey={normalizeAirportRefKey(airport)}
            />
          ) : (
            <FlightAirport
              key={airport.join(",")}
              longitude={airport[0]}
              latitude={airport[1]}
              markerContent={markerContent}
              showLabel={false}
              dedupeKey={normalizeAirportRefKey(airport)}
            />
          ),
        )}
    </>
  );
}

type FlightMultiRouteProps = {
  /**
   * Ordered list of waypoints (airports) defining the multi-leg route.
   * Must contain at least 2 entries.
   * Example: `["TPE", "NRT", "LAX"]` renders TPE→NRT and NRT→LAX.
   */
  waypoints: readonly AirportRef[];
  /** Optional unique identifier prefix for route layers */
  id?: string;
  /** Route line color; when omitted, uses theme-aware stroke (see FlightRoute `color`). */
  color?: string;
  /** Route line width in pixels (default: 2) */
  width?: number;
  /** Route line opacity from 0 to 1 (default: 0.7) */
  opacity?: number;
  /**
   * Line style preset (default: "solid")
   * - "solid": continuous line
   * - "dash": dashed line (— — —)
   * - "dot": dotted line (· · ·)
   */
  lineStyle?: "solid" | "dash" | "dot";
  /** Number of arc interpolation points per leg (default: 100) */
  npoints?: number;
  /** Whether to render airport markers at each waypoint (default: false) */
  showAirports?: boolean;
  /** Whether to show the airport code label on markers (default: false). Only effective when showAirports is true. */
  showLabel?: boolean;
  /** Additional CSS classes for the airport label */
  labelClassName?: string;
  /**
   * Custom marker content for auto-rendered airport markers.
   * See FlightAirportProps.markerContent for examples.
   */
  markerContent?: ReactNode;
  /**
   * Custom marker content for intermediate (stopover) airports.
   * When provided, stopover airports use this marker instead of markerContent.
   * Useful for visually distinguishing origin/destination from transfer points.
   */
  stopoverMarkerContent?: ReactNode;
  /** Callback when any leg line is clicked, receives leg index */
  onLegClick?: (legIndex: number) => void;
  /** Whether routes are interactive (default: true) */
  interactive?: boolean;
  /**
   * Enable flight animation across all legs sequentially.
   * A single airplane flies from the first waypoint through each intermediate
   * stop to the last waypoint, with speed proportional to leg distance.
   * - `true`: animate with default settings
   * - `FlightRouteAnimateConfig`: animate with custom settings
   * - `false` / `undefined`: no animation (static routes)
   */
  animate?: boolean | FlightRouteAnimateConfig;
  /** Whether to show hover effect on route lines (default: true) */
  hoverEffect?: boolean;
  /**
   * Trip type for hover tooltip display on each leg (default: "one-way").
   */
  tripType?: "one-way" | "round-trip";
};

function FlightMultiRoute({
  waypoints,
  id: propId,
  color,
  width = 2,
  opacity = 0.7,
  lineStyle = "solid",
  npoints = 100,
  showAirports = false,
  showLabel = false,
  labelClassName,
  markerContent,
  stopoverMarkerContent,
  onLegClick,
  interactive = true,
  animate,
  hoverEffect = true,
  tripType = "one-way",
}: FlightMultiRouteProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const flightMapTheme = useFlightMapTheme();

  // Normalize animate prop
  const animateConfig = useMemo<FlightRouteAnimateConfig | null>(() => {
    if (!animate) return null;
    if (animate === true) return {};
    return animate;
  }, [animate]);

  // Resolve all waypoint coordinates for animation
  // Use value-based key to avoid recalculation when arrays are recreated with same values
  const waypointsKey = waypoints
    .map((wp) => (typeof wp === "string" ? wp : `${wp[0]},${wp[1]}`))
    .join("|");
  const waypointCoords = useMemo(() => {
    if (waypoints.length < 2) return null;
    try {
      return waypoints.map((wp) => resolveAirport(wp));
    } catch (e) {
      console.warn(e);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waypointsKey]);

  if (waypoints.length < 2) {
    console.warn("FlightMultiRoute requires at least 2 waypoints");
    return null;
  }

  // Build legs: pairs of consecutive waypoints
  const legs: { from: AirportRef; to: AirportRef }[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    legs.push({ from: waypoints[i], to: waypoints[i + 1] });
  }

  return (
    <>
      {/* Render each leg as a FlightRoute */}
      {legs.map((leg, index) => (
        <FlightRoute
          key={`${id}-leg-${index}`}
          id={`${id}-leg-${index}`}
          from={leg.from}
          to={leg.to}
          color={color}
          width={width}
          opacity={opacity}
          lineStyle={lineStyle}
          npoints={npoints}
          interactive={interactive}
          hoverEffect={hoverEffect}
          tripType={tripType}
          showAirports={false}
          onClick={onLegClick ? () => onLegClick(index) : undefined}
        />
      ))}
      {/* Render airport markers at each waypoint */}
      {showAirports &&
        waypoints.map((wp, index) => {
          const isEndpoint = index === 0 || index === waypoints.length - 1;
          const marker =
            !isEndpoint && stopoverMarkerContent !== undefined ? (
              stopoverMarkerContent
            ) : !isEndpoint ? (
              <div
                className={cn(
                  "relative h-2.5 w-2.5 rounded-full border-2 shadow-lg",
                  flightMapTheme === "dark"
                    ? "border-neutral-700 bg-neutral-100"
                    : "border-white bg-neutral-950",
                )}
              />
            ) : (
              markerContent
            );

          return typeof wp === "string" ? (
            <FlightAirport
              key={`${id}-wp-${wp}-${index}`}
              code={wp}
              markerContent={marker}
              showLabel={showLabel}
              labelClassName={labelClassName}
              dedupeKey={normalizeAirportRefKey(wp)}
            />
          ) : (
            <FlightAirport
              key={`${id}-wp-${wp.join(",")}-${index}`}
              longitude={wp[0]}
              latitude={wp[1]}
              markerContent={marker}
              showLabel={false}
              dedupeKey={normalizeAirportRefKey(wp)}
            />
          );
        })}
      {/* Animation marker across all legs */}
      {animateConfig && waypointCoords && waypointCoords.length >= 2 && (
        <FlightMultiLegAnimationMarker
          waypointCoords={waypointCoords}
          npoints={npoints}
          config={animateConfig}
        />
      )}
    </>
  );
}

/** Default airplane SVG icon (points north / ↑) */
function DefaultAirplaneIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Interpolate a position along coordinates at progress t (0-1). */
function interpolatePosition(
  coords: [number, number][],
  t: number,
): [number, number] {
  if (coords.length === 0) return [0, 0];
  if (t <= 0) return coords[0];
  if (t >= 1) return coords[coords.length - 1];

  const totalSegments = coords.length - 1;
  const exactIndex = t * totalSegments;
  const i = Math.floor(exactIndex);
  const frac = exactIndex - i;

  if (i >= totalSegments) return coords[coords.length - 1];

  const a = coords[i];
  const b = coords[i + 1];
  return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
}

/** Normalize longitude into the canonical [-180, 180] range for MapLibre and turf APIs. */
function normalizeLongitude(lng: number): number {
  let normalized = ((((lng + 180) % 360) + 360) % 360) - 180;
  if (normalized === -180 && lng > 0) {
    normalized = 180;
  }
  return normalized;
}

/** Normalize a coordinate tuple before passing it to MapLibre or turf calculations. */
function normalizeLngLat(coord: [number, number]): [number, number] {
  return [normalizeLongitude(coord[0]), coord[1]];
}

/**
 * Calculate airplane rotation (degrees CW from screen-up, 0-360).
 * Prefer screen-space tangent so the icon follows the visible arc under globe
 * and other non-linear projections; fall back to geographic bearing.
 */
function calculateMarkerRotation(
  map: MapLibreGL.Map | null,
  from: [number, number],
  to: [number, number],
): number {
  const normalizedFrom = normalizeLngLat(from);
  const normalizedTo = normalizeLngLat(to);

  if (map) {
    try {
      const fromPoint = map.project(normalizedFrom);
      const toPoint = map.project(normalizedTo);
      const dx = toPoint.x - fromPoint.x;
      const dy = toPoint.y - fromPoint.y;

      if (
        Number.isFinite(dx) &&
        Number.isFinite(dy) &&
        (dx !== 0 || dy !== 0)
      ) {
        const degrees = (Math.atan2(dx, -dy) * 180) / Math.PI;
        return ((degrees % 360) + 360) % 360;
      }
    } catch {
      // Fall back to geographic bearing when projection data is unavailable.
    }
  }

  const b = bearing(normalizedFrom, normalizedTo);
  return ((b % 360) + 360) % 360;
}

/**
 * Internal component: renders the animated airplane marker along an arc.
 * Used by FlightRoute when `animate` is enabled — not exported.
 */
function FlightAnimationMarker({
  fromCoords,
  toCoords,
  npoints,
  config,
}: {
  fromCoords: [number, number];
  toCoords: [number, number];
  npoints: number;
  config: FlightRouteAnimateConfig;
}) {
  const { map } = useMap();
  const markerRef = useRef<MapLibreGL.Marker | null>(null);
  const markerElRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [markerEl, setMarkerEl] = useState<HTMLDivElement | null>(null);

  const {
    duration = 4000,
    progress: controlledProgress,
    loop = true,
    roundTrip = false,
    icon,
    iconClassName,
    iconSize = 24,
    onProgress,
    onComplete,
  } = config;

  const isControlled = controlledProgress !== undefined;

  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onProgressRef.current = onProgress;
    onCompleteRef.current = onComplete;
  });

  // Generate arc coordinates for the outbound path
  const arcCoords = useMemo(
    () => generateArcCoordinates(fromCoords, toCoords, npoints),
    [fromCoords, toCoords, npoints],
  );

  // For roundTrip, pre-compute the reversed return path
  const returnArcCoords = useMemo(() => {
    if (!roundTrip) return null;
    return generateArcCoordinates(toCoords, fromCoords, npoints);
  }, [roundTrip, toCoords, fromCoords, npoints]);

  // Update marker position & rotation for a given raw progress t (0-1)
  const updateMarker = useCallback(
    (t: number) => {
      if (!arcCoords || arcCoords.length < 2 || !markerRef.current) return;

      let coords: [number, number][];
      let segmentT: number;

      if (roundTrip && returnArcCoords && returnArcCoords.length >= 2) {
        // First half (0-0.5): outbound, second half (0.5-1): return
        if (t <= 0.5) {
          coords = arcCoords;
          segmentT = t * 2; // map 0-0.5 → 0-1
        } else {
          coords = returnArcCoords;
          segmentT = (t - 0.5) * 2; // map 0.5-1 → 0-1
        }
      } else {
        coords = arcCoords;
        segmentT = t;
      }

      const pos = interpolatePosition(coords, segmentT);
      markerRef.current.setLngLat(normalizeLngLat(pos));

      // Look slightly ahead for bearing; fall back to looking behind at segment end
      const lookAhead = Math.min(segmentT + 0.005, 1);
      const nextPos = interpolatePosition(coords, lookAhead);
      if (pos[0] !== nextPos[0] || pos[1] !== nextPos[1]) {
        const deg = calculateMarkerRotation(map, pos, nextPos);
        markerRef.current.setRotation(deg);
      } else {
        // At segment end, look backward to maintain correct heading
        const lookBehind = Math.max(segmentT - 0.005, 0);
        const prevPos = interpolatePosition(coords, lookBehind);
        if (prevPos[0] !== pos[0] || prevPos[1] !== pos[1]) {
          const deg = calculateMarkerRotation(map, prevPos, pos);
          markerRef.current.setRotation(deg);
        }
      }

      onProgressRef.current?.(t);
    },
    [arcCoords, returnArcCoords, roundTrip, map],
  );

  // Create / destroy MapLibre Marker
  useEffect(() => {
    if (!map || !arcCoords || arcCoords.length < 2) return;

    const el = document.createElement("div");
    markerElRef.current = el;

    const marker = new MapLibreGL.Marker({
      element: el,
      anchor: "center",
      rotationAlignment: "map",
      pitchAlignment: "map",
    })
      .setLngLat(normalizeLngLat(arcCoords[0]))
      .addTo(map);

    markerRef.current = marker;
    // Schedule state update outside the synchronous effect body to avoid
    // react-hooks/set-state-in-effect (this is a legitimate portal container).
    queueMicrotask(() => setMarkerEl(el));

    return () => {
      marker.remove();
      markerRef.current = null;
      markerElRef.current = null;
      queueMicrotask(() => setMarkerEl(null));
    };
  }, [map, arcCoords]);

  // Controlled mode
  useEffect(() => {
    if (!isControlled) return;
    updateMarker(controlledProgress);
  }, [isControlled, controlledProgress, updateMarker]);

  // Auto-play mode
  useEffect(() => {
    if (isControlled || !arcCoords || arcCoords.length < 2) return;

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      let t = elapsed / duration;

      if (t >= 1) {
        onCompleteRef.current?.();
        if (loop) {
          // Carry over excess time for smooth loop transition instead of jumping to start
          const remainder = elapsed % duration;
          startTimeRef.current = timestamp - remainder;
          t = remainder / duration;
        } else {
          // Non-loop: finish and hide marker
          t = 1;
          updateMarker(t);
          // Hide the marker element so airplane disappears at destination
          if (markerElRef.current) {
            markerElRef.current.style.visibility = "hidden";
          }
          return;
        }
      }

      // Ensure visible (in case restarted after being hidden)
      if (markerElRef.current) {
        markerElRef.current.style.visibility = "visible";
      }

      updateMarker(t);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Reset visibility when animation starts
    if (markerElRef.current) {
      markerElRef.current.style.visibility = "visible";
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isControlled, duration, loop, arcCoords, updateMarker]);

  if (!arcCoords || arcCoords.length < 2) return null;

  return (
    <>
      {markerEl &&
        createPortal(
          <div
            className={cn(
              "flex items-center justify-center text-white drop-shadow-lg",
              iconClassName,
            )}
            style={{ width: iconSize, height: iconSize }}
          >
            {icon || <DefaultAirplaneIcon size={iconSize} />}
          </div>,
          markerEl,
        )}
    </>
  );
}

/**
 * Internal component: renders a single animated airplane marker that flies
 * sequentially across multiple legs (used by FlightMultiRoute).
 *
 * Each leg's share of the total progress is proportional to its geographic
 * distance so the airplane appears to move at a constant speed.
 */
function FlightMultiLegAnimationMarker({
  waypointCoords,
  npoints,
  config,
}: {
  waypointCoords: [number, number][];
  npoints: number;
  config: FlightRouteAnimateConfig;
}) {
  const { map } = useMap();
  const markerRef = useRef<MapLibreGL.Marker | null>(null);
  const markerElRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [markerEl, setMarkerEl] = useState<HTMLDivElement | null>(null);

  const {
    duration = 4000,
    progress: controlledProgress,
    loop = true,
    roundTrip = false,
    icon,
    iconClassName,
    iconSize = 24,
    onProgress,
    onComplete,
  } = config;

  const isControlled = controlledProgress !== undefined;

  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onProgressRef.current = onProgress;
    onCompleteRef.current = onComplete;
  });

  // Pre-compute all leg arc coordinates and cumulative distance breakpoints
  const legData = useMemo(() => {
    if (waypointCoords.length < 2) return null;

    const legs: { coords: [number, number][]; distance: number }[] = [];
    let totalDistance = 0;

    for (let i = 0; i < waypointCoords.length - 1; i++) {
      const from = waypointCoords[i];
      const to = waypointCoords[i + 1];
      const coords = generateArcCoordinates(from, to, npoints);
      const dist = haversineDistance(from, to);
      legs.push({ coords, distance: dist });
      totalDistance += dist;
    }

    // Build cumulative breakpoints: breakpoints[i] is the progress value
    // at which leg i starts (breakpoints[0] = 0, breakpoints[legs.length] = 1)
    const breakpoints: number[] = [0];
    let cumulative = 0;
    for (const leg of legs) {
      cumulative += leg.distance;
      breakpoints.push(totalDistance > 0 ? cumulative / totalDistance : 0);
    }
    // Ensure last breakpoint is exactly 1
    breakpoints[breakpoints.length - 1] = 1;

    return { legs, breakpoints, totalDistance };
  }, [waypointCoords, npoints]);

  // For roundTrip, pre-compute the reversed leg data
  const returnLegData = useMemo(() => {
    if (!roundTrip || !legData) return null;

    const reversedWaypoints = [...waypointCoords].reverse();
    const legs: { coords: [number, number][]; distance: number }[] = [];
    let totalDistance = 0;

    for (let i = 0; i < reversedWaypoints.length - 1; i++) {
      const from = reversedWaypoints[i];
      const to = reversedWaypoints[i + 1];
      const coords = generateArcCoordinates(from, to, npoints);
      const dist = haversineDistance(from, to);
      legs.push({ coords, distance: dist });
      totalDistance += dist;
    }

    const breakpoints: number[] = [0];
    let cumulative = 0;
    for (const leg of legs) {
      cumulative += leg.distance;
      breakpoints.push(totalDistance > 0 ? cumulative / totalDistance : 0);
    }
    breakpoints[breakpoints.length - 1] = 1;

    return { legs, breakpoints, totalDistance };
  }, [roundTrip, waypointCoords, npoints, legData]);

  // Given a progress t and leg data, compute position and bearing
  const computePositionAndBearing = useCallback(
    (
      t: number,
      data: { legs: { coords: [number, number][] }[]; breakpoints: number[] },
    ): { pos: [number, number]; bearing: number } => {
      const { legs, breakpoints } = data;

      // Find which leg we're in
      let legIndex = 0;
      for (let i = 0; i < legs.length; i++) {
        if (t <= breakpoints[i + 1]) {
          legIndex = i;
          break;
        }
        if (i === legs.length - 1) {
          legIndex = i;
        }
      }

      const legStart = breakpoints[legIndex];
      const legEnd = breakpoints[legIndex + 1];
      const legRange = legEnd - legStart;
      const legT = legRange > 0 ? (t - legStart) / legRange : 0;
      const clampedLegT = Math.max(0, Math.min(1, legT));

      const coords = legs[legIndex].coords;
      const pos = interpolatePosition(coords, clampedLegT);

      // Look ahead for bearing; fall back to looking behind at segment end
      const lookAhead = Math.min(clampedLegT + 0.01, 1);
      const nextPos = interpolatePosition(coords, lookAhead);
      let deg = 0;
      if (pos[0] !== nextPos[0] || pos[1] !== nextPos[1]) {
        deg = calculateMarkerRotation(map, pos, nextPos);
      } else {
        // At segment end, look backward to maintain correct heading
        const lookBehind = Math.max(clampedLegT - 0.01, 0);
        const prevPos = interpolatePosition(coords, lookBehind);
        if (prevPos[0] !== pos[0] || prevPos[1] !== pos[1]) {
          deg = calculateMarkerRotation(map, prevPos, pos);
        }
      }

      return { pos, bearing: deg };
    },
    [map],
  );

  // Update marker position & rotation for a given raw progress t (0-1)
  const updateMarker = useCallback(
    (t: number) => {
      if (!legData || !markerRef.current) return;

      let data: {
        legs: { coords: [number, number][] }[];
        breakpoints: number[];
      };
      let segmentT: number;

      if (roundTrip && returnLegData) {
        if (t <= 0.5) {
          data = legData;
          segmentT = t * 2;
        } else {
          data = returnLegData;
          segmentT = (t - 0.5) * 2;
        }
      } else {
        data = legData;
        segmentT = t;
      }

      const { pos, bearing: deg } = computePositionAndBearing(segmentT, data);
      markerRef.current.setLngLat(normalizeLngLat(pos));
      markerRef.current.setRotation(deg);

      onProgressRef.current?.(t);
    },
    [legData, returnLegData, roundTrip, computePositionAndBearing],
  );

  // Create / destroy MapLibre Marker
  useEffect(() => {
    if (!map || !legData) return;

    const el = document.createElement("div");
    markerElRef.current = el;

    const firstCoord = legData.legs[0]?.coords[0];
    if (!firstCoord) return;

    const marker = new MapLibreGL.Marker({
      element: el,
      anchor: "center",
      rotationAlignment: "map",
      pitchAlignment: "map",
    })
      .setLngLat(normalizeLngLat(firstCoord))
      .addTo(map);

    markerRef.current = marker;
    // Schedule state update outside the synchronous effect body to avoid
    // react-hooks/set-state-in-effect (this is a legitimate portal container).
    queueMicrotask(() => setMarkerEl(el));

    return () => {
      marker.remove();
      markerRef.current = null;
      markerElRef.current = null;
      queueMicrotask(() => setMarkerEl(null));
    };
  }, [map, legData]);

  // Controlled mode
  useEffect(() => {
    if (!isControlled) return;
    updateMarker(controlledProgress);
  }, [isControlled, controlledProgress, updateMarker]);

  // Auto-play mode
  useEffect(() => {
    if (isControlled || !legData) return;

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      let t = elapsed / duration;

      if (t >= 1) {
        onCompleteRef.current?.();
        if (loop) {
          // Carry over excess time for smooth loop transition instead of jumping to start
          const remainder = elapsed % duration;
          startTimeRef.current = timestamp - remainder;
          t = remainder / duration;
        } else {
          t = 1;
          updateMarker(t);
          if (markerElRef.current) {
            markerElRef.current.style.visibility = "hidden";
          }
          return;
        }
      }

      if (markerElRef.current) {
        markerElRef.current.style.visibility = "visible";
      }

      updateMarker(t);
      animationRef.current = requestAnimationFrame(animate);
    };

    if (markerElRef.current) {
      markerElRef.current.style.visibility = "visible";
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isControlled, duration, loop, legData, updateMarker]);

  if (!legData) return null;

  return (
    <>
      {markerEl &&
        createPortal(
          <div
            className={cn(
              "flex items-center justify-center text-white drop-shadow-lg",
              iconClassName,
            )}
            style={{ width: iconSize, height: iconSize }}
          >
            {icon || <DefaultAirplaneIcon size={iconSize} />}
          </div>,
          markerEl,
        )}
    </>
  );
}

export {
  Map,
  useMap,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MarkerLabel,
  MapPopup,
  MapControls,
  MapRoute,
  MapClusterLayer,
  FlightAirport,
  FlightRoute,
  FlightRoutes,
  FlightMultiRoute,
  resolveAirport,
  getAirportInfo,
  generateArcGeometry,
  generateArcCoordinates,
};
export type {
  FlightRouteAnimateConfig,
  FlightRouteProps,
  FlightAirportProps,
  FlightRouteData,
  FlightRoutesProps,
  FlightMultiRouteProps,
};

export default Map;
