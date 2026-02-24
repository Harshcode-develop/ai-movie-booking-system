import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock } from "lucide-react";
import CardInput from "./CardInput";
import type { PaymentDetails } from "../../types";

interface PaymentFormProps {
  amount: number;
  onSubmit: (details: PaymentDetails) => Promise<void>;
  isLoading: boolean;
}

export default function PaymentForm({
  amount,
  onSubmit,
  isLoading,
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState<
    "VISA" | "MASTERCARD" | "AMEX" | null
  >(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [saveCard, setSaveCard] = useState(false);

  useEffect(() => {
    // Detect card type
    if (cardNumber.startsWith("4")) setCardType("VISA");
    else if (cardNumber.startsWith("5")) setCardType("MASTERCARD");
    else if (cardNumber.startsWith("3")) setCardType("AMEX");
    else setCardType(null);
  }, [cardNumber]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !expiryMonth || !expiryYear || !cvv)
      return;

    onSubmit({
      cardNumber,
      cardType,
      expiryMonth,
      expiryYear,
      cvv,
      cardHolderName: cardHolder,
      saveCard,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col">
      <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center overflow-y-auto pr-2">
        {/* Left Col: Card Visual */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="scale-90 origin-center w-full max-w-[360px]">
            <CardInput
              cardNumber={cardNumber}
              cardHolder={cardHolder}
              expiryMonth={expiryMonth}
              expiryYear={expiryYear}
              cvv={cvv}
              cardType={cardType}
              focusedData={focused}
            />
          </div>
          <p className="text-center text-xs text-text-muted mt-6 max-w-xs">
            Your payment information is encrypted and secure. We do not store
            your CVV.
          </p>
        </div>

        {/* Right Col: Inputs */}
        <div className="space-y-4 max-w-md mx-auto w-full">
          {/* Card Number */}
          <div className="relative">
            <label className="text-xs font-medium text-text-secondary mb-1 block">
              Card Number
            </label>
            <div className="relative">
              <CreditCard
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                size={16}
              />
              <input
                type="text"
                value={cardNumber}
                onChange={handleNumberChange}
                onFocus={() => setFocused("number")}
                className="w-full bg-bg-secondary border border-border rounded-lg py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
            </div>
          </div>

          {/* Card Holder */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">
              Card Holder Name
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              onFocus={() => setFocused("name")}
              className="w-full bg-bg-secondary border border-border rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary transition-colors uppercase"
              placeholder="JOHN DOE"
            />
          </div>

          <div className="flex gap-4">
            {/* Expiry */}
            <div className="flex-1">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                Expiry Date
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={expiryMonth}
                  onChange={(e) =>
                    setExpiryMonth(
                      e.target.value.replace(/\D/g, "").slice(0, 2),
                    )
                  }
                  onFocus={() => setFocused("expiry")}
                  className="w-full bg-bg-secondary border border-border rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary transition-colors text-center"
                  placeholder="MM"
                />
                <input
                  type="text"
                  value={expiryYear}
                  onChange={(e) =>
                    setExpiryYear(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  onFocus={() => setFocused("expiry")}
                  className="w-full bg-bg-secondary border border-border rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary transition-colors text-center"
                  placeholder="YYYY"
                />
              </div>
            </div>

            {/* CVV */}
            <div className="w-1/3">
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                CVV
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  size={14}
                />
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  onFocus={() => setFocused("cvv")}
                  className="w-full bg-bg-secondary border border-border rounded-lg py-2.5 pl-8 pr-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="123"
                />
              </div>
            </div>
          </div>

          {/* Save Card */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="saveCard"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-border bg-bg-secondary text-primary focus:ring-primary"
            />
            <label
              htmlFor="saveCard"
              className="text-xs text-text-secondary select-none cursor-pointer"
            >
              Save card for future
            </label>
          </div>
        </div>
      </div>

      {/* Footer / Submit Button */}
      <div className="mt-4 pt-4 border-t border-border">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={
            isLoading ||
            !cardNumber ||
            !cardHolder ||
            !expiryMonth ||
            !expiryYear ||
            !cvv
          }
          className="w-full max-w-md mx-auto bg-linear-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Lock size={16} />
              Secure Pay ₹{amount}
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
