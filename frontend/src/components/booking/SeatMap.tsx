import { motion } from "framer-motion";
import type { Seat } from "../../types";

interface SeatMapProps {
  seats: Seat[];
  selectedSeatIds: number[];
  onSeatClick: (seat: Seat) => void;
  format?: string;
}

export default function SeatMap({
  seats,
  selectedSeatIds,
  onSeatClick,
  format,
}: SeatMapProps) {
  // Group seats by row
  const rows = [...new Set(seats.map((seat) => seat.rowLabel))].sort();

  // Group seats by row for easier rendering
  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.rowLabel]) acc[seat.rowLabel] = [];
      acc[seat.rowLabel].push(seat);
      return acc;
    },
    {} as Record<string, Seat[]>,
  );

  // Sort seats in each row by seat number (numeric sort)
  Object.keys(seatsByRow).forEach((row) => {
    seatsByRow[row].sort(
      (a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber),
    );
  });

  const getSeatColor = (seat: Seat, isSelected: boolean) => {
    if (seat.status === "BOOKED")
      return "bg-gray-700/50 cursor-not-allowed border-transparent opacity-50";
    if (seat.status === "LOCKED")
      return "bg-gray-700/50 cursor-not-allowed border-transparent opacity-50";
    if (isSelected)
      return "bg-primary border-primary text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]";

    switch (seat.tier) {
      case "VIP":
        return "bg-white border-primary hover:bg-primary/10";
      case "PREMIUM":
        return "bg-white border-primary/60 hover:bg-primary/10";
      case "PRIME":
        return "bg-white border-primary/40 hover:bg-primary/10";
      case "CLASSIC":
        return "bg-white border-primary/20 hover:bg-primary/10";
      default:
        return "bg-bg-secondary border-border";
    }
  };

  // Group by tier for section headers
  const sections = rows.reduce(
    (acc, rowLabel) => {
      const firstSeat = seatsByRow[rowLabel][0];
      const tier = firstSeat.tier;
      if (!acc.length || acc[acc.length - 1].tier !== tier) {
        acc.push({ tier, rows: [rowLabel] });
      } else {
        acc[acc.length - 1].rows.push(rowLabel);
      }
      return acc;
    },
    [] as { tier: string; rows: string[] }[],
  );

  const getTierName = (tier: string) => {
    switch (tier) {
      case "VIP":
        return "Royale Recliners";
      case "PRIME":
        return "Prime";
      case "PREMIUM":
        return "Classic Plus";
      case "CLASSIC":
        return "Classic";
      default:
        return tier;
    }
  };

  const getScreenDesign = () => {
    switch (format) {
      case "IMAX_3D":
      case "IMAX_2D":
        return (
          <div className="w-full max-w-2xl mt-12 relative mx-auto opacity-90">
            <div className="h-2 w-full bg-blue-500/30 rounded-full blur-[2px]" />
            <svg
              className="w-full h-10 -mt-2 opacity-40 shrink-0"
              viewBox="0 0 400 30"
            >
              <path
                d="M5 28 C 100 0, 300 0, 395 28"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-center text-[10px] text-primary uppercase tracking-[0.4em] font-black -mt-1 drop-shadow-sm">
              IMAX EXPERIENCE
            </p>
          </div>
        );
      case "FOUR_DX":
        return (
          <div className="w-full max-w-lg mt-12 relative mx-auto opacity-90 group">
            <div className="h-1.5 w-full bg-red-600/30 rounded-full blur-[1px] animate-pulse" />
            <div className="w-full h-4 -mt-1 bg-linear-to-b from-red-600/10 to-transparent skew-x-12" />
            <p className="text-center text-[10px] text-red-600 uppercase tracking-[0.4em] font-black mt-2">
              4DX MOTION SENSORY
            </p>
          </div>
        );
      default:
        return (
          <div className="w-full max-w-lg mt-12 relative mx-auto opacity-80">
            <div className="h-1 w-full bg-gray-400/40 rounded-full" />
            <svg className="w-full h-6 -mt-1 opacity-20" viewBox="0 0 400 30">
              <path
                d="M20 20 C 120 15, 280 15, 380 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-center text-[9px] text-text-muted uppercase tracking-[0.2em] font-bold -mt-2">
              All eyes this way
            </p>
          </div>
        );
    }
  };

  const seatShapeClass = format === "FOUR_DX" ? "rounded-lg" : "rounded-sm";

  return (
    <div className="w-full overflow-x-auto pb-12 pt-8 no-scrollbar scroll-smooth">
      <div className="min-w-fit flex flex-col items-center gap-3 px-8">
        {/* Seats by tiers */}
        <div className="space-y-12 mb-20 w-full">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 w-full opacity-60">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted whitespace-nowrap">
                    ₹{seats.find((s) => s.tier === section.tier)?.basePrice}{" "}
                    {getTierName(section.tier)}
                  </span>
                  <div className="h-px bg-border flex-1" />
                </div>
              </div>

              <div className="space-y-3">
                {section.rows.map((rowLabel) => (
                  <div
                    key={rowLabel}
                    className="flex items-center gap-6 justify-center"
                  >
                    <span className="w-6 text-[11px] font-bold text-text-muted text-center">
                      {rowLabel}
                    </span>

                    <div className="flex gap-4">
                      {Array.from(
                        new Set(
                          seatsByRow[rowLabel].map(
                            (s) => s.metadata?.blockId || 0,
                          ),
                        ),
                      )
                        .sort((a, b) => a - b)
                        .map((blockId) => (
                          <div
                            key={blockId}
                            className={`flex ${format === "FOUR_DX" ? "gap-2.5" : "gap-1.5"}`}
                          >
                            {seatsByRow[rowLabel]
                              .filter(
                                (s) => (s.metadata?.blockId || 0) === blockId,
                              )
                              .map((seat) => {
                                const isSelected = selectedSeatIds.includes(
                                  seat.id,
                                );
                                const isBooked =
                                  seat.status === "BOOKED" ||
                                  seat.status === "LOCKED";

                                return (
                                  <motion.button
                                    key={seat.id}
                                    whileHover={
                                      !isBooked ? { scale: 1.15, y: -2 } : {}
                                    }
                                    whileTap={!isBooked ? { scale: 0.95 } : {}}
                                    onClick={() =>
                                      !isBooked && onSeatClick(seat)
                                    }
                                    disabled={isBooked}
                                    className={`w-7 h-7 ${seatShapeClass} text-[9px] font-black transition-all border ${getSeatColor(seat, isSelected)} flex items-center justify-center`}
                                  >
                                    {seat.seatNumber}
                                  </motion.button>
                                );
                              })}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Screen */}
        {getScreenDesign()}
      </div>
    </div>
  );
}
