import { motion } from "framer-motion";

interface CardInputProps {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardType: string | null;
  focusedData: string | null;
}

export default function CardInput({
  cardNumber,
  cardHolder,
  expiryMonth,
  expiryYear,
  cvv,
  cardType,
  focusedData,
}: CardInputProps) {
  // Format card number with spaces
  const formattedNumber = cardNumber
    .padEnd(16, "#")
    .replace(/(.{4})/g, "$1 ")
    .trim();

  return (
    <div className="perspective-1000 w-full max-w-[400px] mx-auto mb-8">
      <motion.div
        className="relative w-full aspect-[1.586] rounded-2xl transition-transform duration-500 transform-style-3d"
        animate={{ rotateY: focusedData === "cvv" ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 backface-hidden flex flex-col justify-between border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/30 rounded-full blur-3xl" />

          <div className="flex justify-between items-start z-10">
            <div className="w-12 h-8 bg-white/20 rounded md:rounded-lg backdrop-blur-sm border border-white/10" />{" "}
            {/* Chip */}
            <div className="text-white text-xl font-bold tracking-widest italic opacity-80">
              {cardType || "BANK"}
            </div>
          </div>

          <div className="z-10 mt-8">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
              Card Number
            </label>
            <div className="text-xl md:text-2xl font-mono text-white tracking-widest whitespace-nowrap overflow-hidden">
              {formattedNumber}
            </div>
          </div>

          <div className="flex justify-between items-end z-10">
            <div className="flex-1 mr-4">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                Card Holder
              </label>
              <div className="text-sm md:text-base text-white uppercase truncate max-w-[200px]">
                {cardHolder || "FULL NAME"}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                Expires
              </label>
              <div className="text-sm md:text-base text-white font-mono">
                {expiryMonth.padStart(2, "0")}/
                {expiryYear.slice(-2).padEnd(2, "0")}
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl backface-hidden rotate-y-180 flex flex-col border border-white/10 overflow-hidden">
          <div className="w-full h-12 bg-black/80 mt-6" />
          <div className="px-6 mt-4">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1 text-right">
              CVV
            </label>
            <div className="w-full h-10 bg-white text-black font-mono flex items-center justify-end px-3 rounded">
              {cvv.replace(/./g, "*")}
            </div>
          </div>
          <div className="mt-auto p-6 flex justify-center">
            <div className="text-white/30 text-xs text-center">
              Use for transactions on AI Movie Booking Platform only.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
