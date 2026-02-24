import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Bike, Check, Car, Bus, Plane, TramFront, X } from "lucide-react";

interface SeatCountModalProps {
  isOpen: boolean;
  onSelect: (count: number) => void;
  onClose?: () => void;
  basePrices: Record<string, number>;
}

export default function SeatCountModal({
  isOpen,
  onSelect,
  onClose,
  basePrices,
}: SeatCountModalProps) {
  const [selected, setSelected] = useState(2);

  const priceEntries = [
    { label: "VIP", key: "VIP", price: basePrices.VIP || 500 },
    { label: "PREMIUM", key: "PREMIUM", price: basePrices.PREMIUM || 350 },
    { label: "PRIME", key: "PRIME", price: basePrices.PRIME || 250 },
    { label: "CLASSIC", key: "CLASSIC", price: basePrices.CLASSIC || 150 },
  ];

  const getVehicleIcon = (count: number) => {
    switch (count) {
      case 1:
        return <Bike size={80} strokeWidth={1.5} />;
      case 2:
        return <Bike size={80} strokeWidth={1.5} className="rotate-3" />; // Scooter-ish
      case 3:
        return <Car size={80} strokeWidth={1.5} className="scale-x-90" />; // Auto-ish
      case 4:
        return <Car size={80} strokeWidth={1.5} />;
      case 5:
        return <Car size={80} strokeWidth={1.5} className="scale-110" />; // SUV-ish
      case 6:
      case 7:
      case 8:
        return <Bus size={80} strokeWidth={1.5} />;
      case 9:
        return <TramFront size={80} strokeWidth={1.5} />;
      case 10:
        return <Plane size={80} strokeWidth={1.5} />;
      default:
        return <Bike size={80} strokeWidth={1.5} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden text-black"
          >
            <div className="p-8 text-center relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-8">How many seats?</h2>

              {/* Animation/Icon Section */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative">
                  <motion.div
                    key={selected}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-primary"
                  >
                    {getVehicleIcon(selected)}
                  </motion.div>
                </div>
              </div>

              {/* Number Selector */}
              <div className="flex justify-between items-center max-w-md mx-auto mb-12">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelected(num)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      selected === num
                        ? "bg-primary text-white scale-110 shadow-lg"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-4 gap-4 border-t border-gray-100 pt-8 mb-8">
                {priceEntries.map((entry) => (
                  <div key={entry.key} className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 mb-1 leading-tight">
                      {entry.label}
                    </p>
                    <p className="text-sm font-bold text-gray-800 tracking-tight">
                      ₹{entry.price}
                    </p>
                    <p className="text-[10px] text-green-500 font-bold mt-1">
                      AVAILABLE
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelect(selected)}
                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
              >
                <span>Select Seats</span>
                <Check
                  size={20}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
