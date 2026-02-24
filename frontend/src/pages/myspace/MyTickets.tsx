import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ticket, Clock, Calendar, MapPin, Loader } from "lucide-react";
import type { Booking } from "../../types";
import { bookingService } from "../../services/bookingService";

export default function MyTickets() {
  const [tickets, setTickets] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let fetchedData: Booking[] = [];
        try {
          fetchedData = await bookingService.getMyTickets();
        } catch (err) {
          console.warn("Failed to fetch tickets from backend", err);
        }

        const localBookings = JSON.parse(
          localStorage.getItem("localBookings") || "[]",
        );

        // combine them, avoiding duplicates by id
        const combined = [...localBookings, ...fetchedData];
        const uniqueTickets = Array.from(
          new Map(combined.map((item) => [item.id, item])).values(),
        );

        // sort by newest
        uniqueTickets.sort(
          (a: any, b: any) =>
            new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime(),
        );

        setTickets(uniqueTickets as Booking[]);
      } catch (err) {
        console.warn("Failed to process tickets", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">My Tickets</h2>

      {tickets.length > 0 ? (
        tickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row"
          >
            {/* Movie Poster Section */}
            <div className="md:w-48 h-48 md:h-auto relative">
              <img
                src={
                  ticket.moviePosterUrl ||
                  "https://via.placeholder.com/200x300?text=Movie"
                }
                alt={ticket.movieTitle || "Movie"}
                className="w-full h-full object-cover"
              />
              {ticket.format && (
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider">
                  {ticket.format}
                </div>
              )}
            </div>

            {/* Ticket Info */}
            <div className="flex-1 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -z-10" />

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">
                    {ticket.movieTitle || "Unknown Movie"}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Booking ID:{" "}
                    <span className="font-mono text-primary">
                      {ticket.bookingRef || `BK${ticket.id}`}
                    </span>
                  </p>
                </div>
                {ticket.paymentStatus === "COMPLETED" && (
                  <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/20">
                    Confirmed
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                    Date
                  </p>
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar size={14} className="text-primary" />
                    {ticket.showDate || "N/A"}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                    Time
                  </p>
                  <div className="flex items-center gap-2 font-medium">
                    <Clock size={14} className="text-primary" />
                    {ticket.showTime || "N/A"}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                    Theater
                  </p>
                  <div className="flex items-center gap-2 font-medium truncate">
                    <MapPin size={14} className="text-primary" />
                    <span className="truncate">
                      {ticket.theaterName || "N/A"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                    Seats
                  </p>
                  <div className="flex items-center gap-2 font-medium">
                    <Ticket size={14} className="text-primary" />
                    {ticket.seats ? ticket.seats.join(", ") : "N/A"}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="text-sm text-text-muted">
                  {ticket.bookedAt
                    ? `Booked on ${new Date(ticket.bookedAt).toLocaleDateString()}`
                    : ""}
                </span>
                <div className="text-right">
                  <p className="text-xs text-text-muted">Total Amount</p>
                  <p className="font-bold text-lg">₹{ticket.totalAmount}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-20 bg-bg-card rounded-2xl border border-border">
          <Ticket
            size={48}
            className="mx-auto text-text-muted mb-4 opacity-50"
          />
          <p className="text-text-secondary">
            You haven't booked any tickets yet.
          </p>
          <p className="text-text-muted text-sm mt-1">
            Start exploring movies and book your first show!
          </p>
        </div>
      )}
    </div>
  );
}
