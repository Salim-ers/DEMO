"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link as LinkIcon, Zap } from "lucide-react";
import { cn } from "../../lib/cn.js";

export interface TimelineItem {
  id: number;
  title: string;
  /** Short mono label shown next to the date/stage (e.g. a vendor or duration). */
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  /**
   * Optional background video (e.g. "/hero/your-clip.mp4"). The clip is muted,
   * looped and covered behind a warm dark veil so the orbit stays readable.
   */
  videoSrc?: string;
  /** Optional poster shown while the video buffers. */
  videoPoster?: string;
  /** Optional header overlay (eyebrow / title) rendered above the orbit. */
  header?: React.ReactNode;
  className?: string;
}

/**
 * Radial orbital timeline — re-skinned for Studio One's warm near-black /
 * bronze → champagne palette and made self-contained (no external UI deps) so
 * it composes with the existing design system. Pass `videoSrc` to play a clip
 * behind the orbit.
 */
export default function RadialOrbitalTimeline({
  timelineData,
  videoSrc,
  videoPoster,
  header,
  className,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval> | undefined;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-studio bg-accent-deep border-accent-deep";
      case "in-progress":
        return "text-studio bg-champagne border-champagne";
      case "pending":
        return "text-champagne bg-canvas/50 border-champagne/40";
      default:
        return "text-champagne bg-canvas/50 border-champagne/40";
    }
  };

  const statusLabel = (status: TimelineItem["status"]): string =>
    status === "completed" ? "TERMINÉ" : status === "in-progress" ? "EN COURS" : "À VENIR";

  return (
    <div
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-canvas",
        className,
      )}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Background video + warm dark veil (click-through so empty-space reset works) */}
      {videoSrc && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <video
            className="h-full w-full object-cover"
            src={videoSrc}
            poster={videoPoster}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas/85 via-canvas/72 to-canvas/92" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent,rgba(5,4,3,0.7))]" />
        </div>
      )}

      {/* Optional header overlay */}
      {header && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-5 pt-24 text-center sm:pt-28">
          {header}
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5E34] via-[#C68642] to-[#E3B36D] animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-champagne/20 animate-ping opacity-70"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-champagne/10 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-8 h-8 rounded-full bg-champagne/80 backdrop-blur-md"></div>
          </div>

          <div className="absolute w-96 h-96 rounded-full border border-champagne/10"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={cn("absolute rounded-full -inset-1", isPulsing && "animate-pulse duration-1000")}
                  style={{
                    background: `radial-gradient(circle, rgba(246,231,204,0.22) 0%, rgba(246,231,204,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                ></div>

                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform",
                    isExpanded
                      ? "bg-accent-deep text-studio border-accent-deep shadow-lg shadow-accent/30 scale-150"
                      : isRelated
                        ? "bg-champagne/50 text-studio border-champagne animate-pulse"
                        : "bg-canvas/80 text-champagne border-champagne/40",
                  )}
                >
                  <Icon size={16} />
                </div>

                <div
                  className={cn(
                    "absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300",
                    isExpanded ? "text-ink scale-125" : "text-champagne/70",
                  )}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 overflow-visible rounded-2xl border border-accent/30 bg-canvas/90 shadow-glow-accent backdrop-blur-lg">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-champagne/50"></div>
                    <div className="flex flex-col space-y-1.5 p-4 pb-2">
                      <div className="flex justify-between items-center">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide",
                            getStatusStyles(item.status),
                          )}
                        >
                          {statusLabel(item.status)}
                        </span>
                        <span className="timecode text-xs text-champagne/50">{item.date}</span>
                      </div>
                      <h3 className="mt-2 text-sm font-semibold tracking-tight text-ink">{item.title}</h3>
                    </div>
                    <div className="p-4 pt-0 text-xs leading-relaxed text-champagne/80">
                      <p>{item.content}</p>

                      <div className="mt-4 pt-3 border-t border-champagne/10">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center">
                            <Zap size={10} className="mr-1" />
                            Charge moteur
                          </span>
                          <span className="timecode">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-champagne/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent to-champagne"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-champagne/10">
                          <div className="flex items-center mb-2">
                            <LinkIcon size={10} className="text-champagne/70 mr-1" />
                            <h4 className="text-[10px] uppercase tracking-wider font-medium text-champagne/70">
                              Étapes liées
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <button
                                  key={relatedId}
                                  type="button"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-md border border-champagne/20 bg-transparent text-champagne/80 transition-all hover:bg-champagne/10 hover:text-ink"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1 text-champagne/60" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
