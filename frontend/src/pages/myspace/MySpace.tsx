import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Ticket,
  History,
  LogOut,
  ChevronLeft,
  Calendar,
  Loader,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MyTickets from "./MyTickets";
import MyInfo from "./MyInfo";
import type { Booking } from "../../types";
import { bookingService } from "../../services/bookingService";

function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-bg-card border border-border p-8 rounded-2xl text-center text-text-secondary">
        <History size={48} className="mx-auto mb-4 opacity-50" />
        <p>No past booking history found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Booking History</h2>
      {bookings.map((booking, index) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-bg-card border border-border rounded-xl p-5 flex items-center gap-5 hover:shadow-sm transition-shadow"
        >
          <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-bg-secondary">
            {booking.moviePosterUrl && (
              <img
                src={booking.moviePosterUrl}
                alt={booking.movieTitle || ""}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-text-primary truncate">
              {booking.movieTitle || "Movie"}
            </h4>
            <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                {booking.showDate || "N/A"}
              </div>
              <span>•</span>
              <span>{booking.theaterName || "N/A"}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-text-primary">
              ₹{booking.totalAmount}
            </p>
            <p
              className={`text-xs font-semibold mt-0.5 ${
                booking.paymentStatus === "COMPLETED"
                  ? "text-accent-green"
                  : "text-accent-red"
              }`}
            >
              {booking.paymentStatus}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function MySpace() {
  const [activeTab, setActiveTab] = useState<
    "tickets" | "info" | "history" | "cards"
  >("tickets");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = [
    { id: "tickets", label: "My Tickets", icon: Ticket },
    { id: "info", label: "My Profile", icon: User },
    { id: "history", label: "Booking History", icon: History },
    { id: "cards", label: "Saved Cards", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-bg-primary pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-bg-secondary transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-3xl font-bold font-display">My Space</h1>
              <p className="text-text-secondary">
                Manage your tickets and profile
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-64 shrink-0">
            <div className="bg-bg-card border border-border rounded-2xl p-4 sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setActiveTab(
                          tab.id as "tickets" | "info" | "history" | "cards",
                        )
                      }
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/25"
                          : "text-text-secondary hover:bg-bg-secondary"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "tickets" && <MyTickets />}
                {activeTab === "info" && <MyInfo />}
                {activeTab === "history" && <BookingHistory />}
                {activeTab === "cards" && <SavedCardsView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedCardsView() {
  const [savedCards, setSavedCards] = useState<any[]>([]);

  useEffect(() => {
    const cards = JSON.parse(localStorage.getItem("savedCards") || "[]");
    setSavedCards(cards);
  }, []);

  const deleteCard = (id: number) => {
    const filtered = savedCards.filter((c) => c.id !== id);
    setSavedCards(filtered);
    localStorage.setItem("savedCards", JSON.stringify(filtered));
  };

  if (savedCards.length === 0) {
    return (
      <div className="bg-bg-card border border-border p-8 rounded-2xl text-center text-text-secondary">
        <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
        <p>No saved cards found.</p>
        <p className="text-sm text-text-muted mt-1">
          Save a card during checkout for faster payments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Saved Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedCards.map((card) => (
          <div
            key={card.id}
            className="bg-bg-card border border-border rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">
                {card.cardType || "Card"}
              </span>
              <button
                onClick={() => deleteCard(card.id)}
                className="text-xs text-red-500 hover:text-red-400 bg-red-500/10 px-2 py-1 rounded cursor-pointer"
              >
                Remove
              </button>
            </div>
            <div>
              <p className="text-xl font-mono tracking-widest text-text-primary">
                •••• •••• •••• {card.lastFour}
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-text-muted uppercase">
                  Card Holder
                </p>
                <p className="text-sm font-semibold">
                  {card.cardHolderName || "USER"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase">Expires</p>
                <p className="text-sm font-medium">
                  {card.expiryMonth}/{card.expiryYear}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-16 bg-primary/5 rounded-full blur-2xl -z-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
