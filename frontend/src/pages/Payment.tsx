import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PaymentForm from "../components/payment/PaymentForm";
import type { PaymentDetails } from "../types";
import { bookingService } from "../services/bookingService";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { show, selectedSeatIds, totalPrice } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);

  if (!show || !selectedSeatIds) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-4 text-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Invalid Booking Session</h2>
          <p className="text-text-secondary mb-4">
            Please restart your booking process.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary px-6 py-2 rounded-full"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handlePaymentSubmit = async (details: PaymentDetails) => {
    setIsLoading(true);
    console.log("Processing payment", details);

    if (details.saveCard) {
      // Create a section in my space with saved cards. We can save this to localStorage for mock persistence or send to backend.
      const savedCards = JSON.parse(localStorage.getItem("savedCards") || "[]");
      savedCards.push({
        id: Date.now(),
        cardType: details.cardType || "VISA",
        lastFour: details.cardNumber.slice(-4),
        expiryMonth: details.expiryMonth,
        expiryYear: details.expiryYear,
        cardHolderName: details.cardHolderName,
      });
      localStorage.setItem("savedCards", JSON.stringify(savedCards));
    }

    try {
      try {
        const booking = await bookingService.completeBooking({
          showId: show.id,
          seatIds: selectedSeatIds,
          cardLastFour: details.cardNumber.slice(-4),
          cardType: details.cardType || "VISA",
        });

        navigate("/confirmation", {
          state: {
            bookingId: booking.bookingRef || `BK${booking.id}`,
            show,
            seats: selectedSeatIds,
            amount: totalPrice,
          },
        });
        return;
      } catch (e) {
        console.warn("Backend failed, using local mock store", e);
      }

      // Mock Success if backend fails
      const mockBookingId = `BK${Math.floor(Math.random() * 1000000)}`;
      const mockBooking = {
        id: Math.floor(Math.random() * 1000),
        bookingRef: mockBookingId,
        movieTitle: show.movieTitle,
        moviePosterUrl: show.moviePosterUrl,
        theaterName: show.theaterName,
        theaterCity: show.theaterCity,
        showDate: show.showDate,
        showTime: show.showTime,
        format: show.format,
        language: show.language,
        seats: selectedSeatIds.map((id: number) => `S${id}`),
        totalAmount: totalPrice,
        paymentStatus: "COMPLETED",
        bookedAt: new Date().toISOString(),
      };

      const localBookings = JSON.parse(
        localStorage.getItem("localBookings") || "[]",
      );
      localBookings.push(mockBooking);
      localStorage.setItem("localBookings", JSON.stringify(localBookings));

      navigate("/confirmation", {
        state: {
          bookingId: mockBookingId,
          show,
          seats: selectedSeatIds,
          amount: totalPrice,
        },
      });
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-60px)] bg-bg-primary overflow-hidden flex flex-col">
      {/* Compact Header */}
      <div className="px-6 py-3 border-b border-border bg-bg-card/50 backdrop-blur-sm z-10 flex-none">
        <div className="container mx-auto max-w-[1400px] flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full hover:bg-bg-secondary transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-bold font-display">Secure Checkout</h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden container mx-auto max-w-[1400px] p-4 lg:p-6">
        <div className="grid lg:grid-cols-12 gap-6 h-full">
          {/* Order Summary Panel */}
          <div className="lg:col-span-4 h-full flex flex-col max-h-[200px] lg:max-h-full">
            <div className="bg-bg-card border border-border rounded-xl p-5 relative overflow-hidden shadow-sm h-full flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-secondary" />
              <h3 className="font-bold text-base mb-4 shrink-0">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm flex-1 overflow-y-auto pr-1">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Movie</span>
                  <span className="font-semibold text-right truncate pl-4">
                    {show.movieTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Theater</span>
                  <span className="font-semibold text-right truncate pl-4">
                    {show.theaterName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Showtime</span>
                  <span className="font-semibold text-right">
                    {show.showTime} | {show.format.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Seats</span>
                  <span className="font-semibold text-right">
                    {selectedSeatIds.length}{" "}
                    <span className="text-xs text-text-muted">Tickets</span>
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-3 mt-3 shrink-0">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form Panel */}
          <div className="lg:col-span-8 h-full bg-bg-card border border-border rounded-xl p-0 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 lg:p-6 h-full overflow-hidden">
              <h3 className="font-bold text-base mb-4">Payment Method</h3>
              <div className="flex-1 h-[calc(100%-40px)]">
                <PaymentForm
                  amount={totalPrice}
                  onSubmit={handlePaymentSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
