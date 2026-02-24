import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "../pages/Home/Home";
import MovieInfo from "../pages/MovieInfo/MovieInfo";
import SelectShowtime from "../pages/SelectShowtime";
import SelectSeats from "../pages/SelectSeats";
import Payment from "../pages/Payment";
import Confirmation from "../pages/Confirmation";
import MySpace from "../pages/myspace/MySpace";
import Movies from "../pages/Movies/Movies";
import PageTransition from "./PageTransition";
import { ChevronLeft } from "lucide-react";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/movies"
          element={
            <PageTransition>
              <Movies />
            </PageTransition>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <PageTransition>
              <MovieInfo />
            </PageTransition>
          }
        />
        <Route
          path="/booking/:movieId"
          element={
            <PageTransition>
              <SelectShowtime />
            </PageTransition>
          }
        />
        <Route
          path="/seats/:showId"
          element={
            <PageTransition>
              <SelectSeats />
            </PageTransition>
          }
        />
        <Route
          path="/payment"
          element={
            <PageTransition>
              <Payment />
            </PageTransition>
          }
        />
        <Route
          path="/confirmation"
          element={
            <PageTransition>
              <Confirmation />
            </PageTransition>
          }
        />

        {/* MySpace Routes */}
        <Route
          path="/myspace"
          element={
            <PageTransition>
              <MySpace />
            </PageTransition>
          }
        />
        <Route
          path="/my-tickets"
          element={<Navigate to="/myspace" replace />}
        />

        <Route
          path="/search"
          element={
            <PageTransition>
              <div className="container mx-auto px-4 py-8">
                <button
                  onClick={() => window.history.back()}
                  className="p-2 rounded-full hover:bg-bg-secondary transition-colors mb-4"
                  aria-label="Go back"
                >
                  <ChevronLeft size={22} />
                </button>
                <h1 className="text-2xl font-bold mb-4">Search Results</h1>
                <p className="text-text-secondary italic">
                  Search Results - Coming Soon
                </p>
              </div>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
