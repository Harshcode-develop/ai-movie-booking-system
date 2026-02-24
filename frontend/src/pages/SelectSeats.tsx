import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { Show, Seat } from "../types";
import SeatMap from "../components/booking/SeatMap";
import SeatLegend from "../components/booking/SeatLegend";
import { format } from "date-fns";
import SeatCountModal from "../components/booking/SeatCountModal";
import { Edit2 } from "lucide-react";

export default function SelectSeats() {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const stateShow = location.state?.show;

  const showInitial = useMemo(() => {
    if (stateShow) return stateShow;
    if (!showId) return null;
    let formatVal = "STANDARD_2D";
    let prices = { CLASSIC: 150, PRIME: 250, PREMIUM: 350, VIP: 500 };

    if (showId.includes("imax")) {
      formatVal = "IMAX_3D";
      prices = { CLASSIC: 250, PRIME: 350, PREMIUM: 450, VIP: 600 };
    } else if (showId.includes("4dx")) {
      formatVal = "FOUR_DX";
      prices = { CLASSIC: 300, PRIME: 400, PREMIUM: 500, VIP: 700 };
    } else if (showId.includes("standard")) {
      formatVal = showId.includes("3d") ? "STANDARD_3D" : "STANDARD_2D";
      prices =
        formatVal === "STANDARD_3D"
          ? { CLASSIC: 180, PRIME: 280, PREMIUM: 380, VIP: 550 }
          : { CLASSIC: 150, PRIME: 250, PREMIUM: 350, VIP: 500 };
    }

    return {
      id: showId,
      movieId: "1",
      theaterId: "1",
      screenId: "1",
      showDate: "2024-03-20",
      showTime: "06:30 PM",
      format: formatVal,
      language: "Hindi",
      basePrices: prices,
      isActive: true,
      movieTitle: "Interstellar",
      moviePosterUrl: "...",
      theaterName: "PVR Cinemas",
      theaterCity: "Pune",
    } as Show;
  }, [showId]);

  const seatsInitial = useMemo(() => {
    if (!showInitial) return [];

    const mockSeats: Seat[] = [];
    let idCounter = 1;
    const formatVal = showInitial.format;

    if (formatVal.includes("IMAX")) {
      // IMAX: Premium/Luxury Layout (3 blocks)
      const imaxLayout = [
        {
          rows: ["A"],
          tier: "VIP",
          blocks: [
            { start: 5, end: 6 },
            { start: 9, end: 15 },
          ],
        },
        {
          rows: ["B"],
          tier: "VIP",
          blocks: [
            { start: 1, end: 2 },
            { start: 3, end: 14 },
            { start: 15, end: 16 },
          ],
        },
        {
          rows: ["C", "D", "E", "F"],
          tier: "PRIME",
          blocks: [
            { start: 1, end: 4 },
            { start: 5, end: 21 },
            { start: 22, end: 25 },
          ],
        },
        {
          rows: ["G", "H"],
          tier: "PRIME",
          blocks: [
            { start: 1, end: 4 },
            { start: 5, end: 21 },
            { start: 22, end: 25 },
          ],
        },
        {
          rows: ["I", "J"],
          tier: "PREMIUM",
          blocks: [
            { start: 1, end: 4 },
            { start: 5, end: 21 },
            { start: 22, end: 25 },
          ],
        },
        {
          rows: ["K", "L"],
          tier: "CLASSIC",
          blocks: [
            { start: 1, end: 2 },
            { start: 3, end: 21 },
            { start: 22, end: 23 },
          ],
        },
      ];

      imaxLayout.forEach((section) => {
        section.rows.forEach((row) => {
          section.blocks.forEach((block, blockIdx) => {
            for (let i = block.start; i <= block.end; i++) {
              mockSeats.push({
                id: idCounter++,
                showId: showInitial.id,
                seatNumber: i < 10 ? `0${i}` : i.toString(),
                rowLabel: row,
                tier: section.tier as any,
                basePrice:
                  showInitial.basePrices[
                    section.tier as keyof typeof showInitial.basePrices
                  ] || 150,
                status: Math.random() > 0.9 ? "BOOKED" : "AVAILABLE",
                lockedBy: null,
                lockedUntil: null,
                metadata: { blockId: blockIdx },
              });
            }
          });
        });
      });
    } else if (formatVal === "FOUR_DX") {
      // 4DX: Seats grouped in 4 for motion effects
      const fourDxLayout = [
        {
          rows: ["A", "B"],
          tier: "VIP",
          blocks: [
            { start: 1, end: 4 },
            { start: 5, end: 8 },
            { start: 9, end: 12 },
          ],
        },
        {
          rows: ["C", "D", "E"],
          tier: "PRIME",
          blocks: [
            { start: 1, end: 4 },
            { start: 5, end: 8 },
            { start: 9, end: 12 },
          ],
        },
        {
          rows: ["F", "G"],
          tier: "CLASSIC",
          blocks: [
            { start: 1, end: 4 },
            { start: 5, end: 8 },
            { start: 9, end: 12 },
          ],
        },
      ];

      fourDxLayout.forEach((section) => {
        section.rows.forEach((row) => {
          section.blocks.forEach((block, blockIdx) => {
            for (let i = block.start; i <= block.end; i++) {
              mockSeats.push({
                id: idCounter++,
                showId: showInitial.id,
                seatNumber: i.toString(),
                rowLabel: row,
                tier: section.tier as any,
                basePrice:
                  showInitial.basePrices[
                    section.tier as keyof typeof showInitial.basePrices
                  ] || 150,
                status: Math.random() > 0.85 ? "BOOKED" : "AVAILABLE",
                lockedBy: null,
                lockedUntil: null,
                metadata: { blockId: blockIdx },
              });
            }
          });
        });
      });
    } else {
      // Standard: Balanced layout for 2D/3D (Cheaper prices)
      const standardLayout = [
        {
          rows: ["A", "B"],
          tier: "PREMIUM",
          blocks: [
            { start: 1, end: 6 },
            { start: 7, end: 20 },
            { start: 21, end: 26 },
          ],
        },
        {
          rows: ["C", "D", "E"],
          tier: "PRIME",
          blocks: [
            { start: 1, end: 6 },
            { start: 7, end: 20 },
            { start: 21, end: 26 },
          ],
        },
        {
          rows: ["F", "G", "H", "I"],
          tier: "CLASSIC",
          blocks: [
            { start: 1, end: 6 },
            { start: 7, end: 20 },
            { start: 21, end: 26 },
          ],
        },
      ];

      standardLayout.forEach((section) => {
        section.rows.forEach((row) => {
          section.blocks.forEach((block, blockIdx) => {
            for (let i = block.start; i <= block.end; i++) {
              mockSeats.push({
                id: idCounter++,
                showId: showInitial.id,
                seatNumber: i.toString(),
                rowLabel: row,
                tier: section.tier as any,
                basePrice:
                  showInitial.basePrices[
                    section.tier as keyof typeof showInitial.basePrices
                  ] || 150,
                status: Math.random() > 0.9 ? "BOOKED" : "AVAILABLE",
                lockedBy: null,
                lockedUntil: null,
                metadata: { blockId: blockIdx },
              });
            }
          });
        });
      });
    }
    return mockSeats;
  }, [showInitial]);

  const show = showInitial;
  const seats = seatsInitial;
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [targetCount, setTargetCount] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { isAuthenticated, openAuthModal } = useAuth();
  const [pendingPayment, setPendingPayment] = useState(false);

  const handleSeatClick = (seat: Seat) => {
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= targetCount) {
        if (targetCount === 1) {
          setSelectedSeatIds([seat.id]);
        } else {
          alert(
            `You can only select ${targetCount} seats. Deselect one to choose another.`,
          );
        }
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seat.id]);
    }
  };

  const totalPrice = useMemo(() => {
    return selectedSeatIds.reduce((total, id) => {
      const seat = seats.find((s) => s.id === id);
      return total + (seat?.basePrice || 0);
    }, 0);
  }, [selectedSeatIds, seats]);

  const handleProceed = () => {
    if (!isAuthenticated) {
      setPendingPayment(true);
      openAuthModal();
      return;
    }
    navigate("/payment", { state: { show, selectedSeatIds, totalPrice } });
  };

  useEffect(() => {
    if (isAuthenticated && pendingPayment) {
      setPendingPayment(false);
      navigate("/payment", { state: { show, selectedSeatIds, totalPrice } });
    }
  }, [
    isAuthenticated,
    pendingPayment,
    navigate,
    show,
    selectedSeatIds,
    totalPrice,
  ]);

  if (!show) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-bg-primary p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-bg-card border border-white/10 p-12 rounded-3xl backdrop-blur-xl shadow-2xl max-w-md">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <ChevronLeft size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-3 bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
              Show Not Found
            </h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              We couldn't retrieve the layout for this show. It might have
              expired or the show ID is invalid.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="btn btn-primary btn-lg w-full rounded-full shadow-lg shadow-primary/20"
              >
                Return to Home
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary w-full rounded-full border-white/10 hover:bg-white/5"
              >
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-32 pt-4">
      <div className="container mx-auto px-4 max-w-[1000px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-bg-secondary transition-colors cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold">{show.movieTitle}</h1>
              <p className="text-sm text-text-secondary">
                {show.theaterName} •{" "}
                {format(new Date(show.showDate), "EEE, d MMM")} •{" "}
                {show.showTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-lg border border-border">
              <span className="text-sm font-bold text-primary">
                {targetCount}
              </span>
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">
                Tickets
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-2 p-1 hover:bg-bg-tertiary rounded text-text-muted hover:text-primary transition-colors cursor-pointer"
              >
                <Edit2 size={14} />
              </button>
            </div>
            <div className="hidden md:block">
              <span className="px-3 py-1 rounded border border-border text-sm font-medium uppercase min-w-[80px] text-center">
                {show.format.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        <SeatCountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={(count) => {
            setTargetCount(count);
            setIsModalOpen(false);
            setSelectedSeatIds([]);
          }}
          basePrices={show.basePrices}
        />

        <div className="bg-bg-card border border-border rounded-2xl p-4 overflow-hidden mb-8">
          <SeatMap
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onSeatClick={handleSeatClick}
            format={show.format}
          />
          <div className="border-t border-border mt-8">
            <SeatLegend />
          </div>
        </div>
      </div>

      {selectedSeatIds.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-bg-card border-t border-border p-4 z-50 shadow-2xl glass"
        >
          <div className="container mx-auto max-w-[1000px] flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted mb-1">Total Price</p>
              <p className="text-2xl font-bold text-primary">₹{totalPrice}</p>
              <p className="text-xs text-text-secondary">
                {selectedSeatIds.length} seats selected
              </p>
            </div>
            <button
              onClick={handleProceed}
              className="btn btn-primary btn-lg px-8 rounded-full shadow-lg hover:shadow-primary/25 cursor-pointer"
            >
              Proceed to Pay
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
