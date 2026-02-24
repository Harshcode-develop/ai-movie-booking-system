import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Calendar, MapPin, Ticket } from "lucide-react";
// @ts-ignore
import confetti from "canvas-confetti";

export default function Confirmation() {
  const location = useLocation();
  const { bookingId, show, amount } = location.state || {};

  useEffect(() => {
    if (bookingId) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [bookingId]);

  if (!bookingId) {
    return (
      <div className="p-8 text-center text-red-500">
        Invalid Confirmation ID
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-bg-card border border-border rounded-3xl overflow-hidden shadow-2xl relative"
        >
          {/* Success Banner */}
          <div className="bg-green-500 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-white text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Check size={32} strokeWidth={4} />
            </motion.div>
            <h1 className="text-2xl font-bold font-display">
              Booking Confirmed!
            </h1>
            <p className="text-white/80">Your tickets are ready.</p>
          </div>

          {/* Ticket Details */}
          <div className="p-8 space-y-6 relative">
            <div className="flex justify-between items-start pb-6 border-b border-border border-dashed">
              <div>
                <h2 className="font-bold text-xl mb-1">{show.movieTitle}</h2>
                <p className="text-sm text-text-secondary uppercase tracking-widest">
                  {show.format}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                {/* Fake QR Code */}
                <div className="p-1 bg-white rounded shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${bookingId}`}
                    alt="QR Code"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                {show.moviePosterUrl || show.posterUrl ? (
                  <img
                    src={show.moviePosterUrl || show.posterUrl}
                    alt="Poster"
                    className="w-16 h-24 object-cover rounded shadow-md"
                  />
                ) : (
                  <div className="w-16 h-24 bg-bg-secondary border border-border rounded shadow-md flex items-center justify-center text-[10px] text-text-muted text-center p-1">
                    No Poster
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                  Date
                </p>
                <div className="flex items-center gap-2 font-medium">
                  <Calendar size={16} className="text-primary" />
                  {show.showDate}
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                  Time
                </p>
                <div className="flex items-center gap-2 font-medium">
                  <Clock size={16} className="text-primary" />
                  {show.showTime}
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                  Theater
                </p>
                <div className="flex items-center gap-2 font-medium">
                  <MapPin size={16} className="text-primary" />
                  {show.theaterName}, {show.theaterCity}
                </div>
              </div>
            </div>

            <div className="bg-bg-secondary p-4 rounded-xl border border-border/50 flex justify-between items-center">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-widest">
                  Booking ID
                </p>
                <p className="font-mono font-bold text-lg tracking-widest">
                  {bookingId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted uppercase tracking-widest">
                  Total Paid
                </p>
                <p className="font-bold text-primary text-xl">₹{amount}</p>
              </div>
            </div>

            {/* Cutout circles for ticket effect */}
            <div className="absolute -left-3 top-[220px] w-6 h-6 bg-bg-primary rounded-full" />
            <div className="absolute -right-3 top-[220px] w-6 h-6 bg-bg-primary rounded-full" />
          </div>

          <div className="p-4 bg-bg-secondary/50 border-t border-border flex flex-col gap-3">
            <Link
              to="/myspace/tickets"
              className="btn btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Ticket size={18} />
              View My Tickets
            </Link>
            <Link
              to="/"
              className="btn btn-ghost w-full py-3 rounded-xl text-text-secondary hover:bg-bg-tertiary"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper icon component since Clock wasn't imported
function Clock(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
