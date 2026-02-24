// Booking and Seat related types
export interface Booking {
  id: number;
  bookingRef: string;
  movieTitle: string;
  moviePosterUrl: string;
  theaterName: string;
  theaterCity: string;
  showDate: string;
  showTime: string;
  format: string;
  language: string;
  seats: string[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookedAt: string;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Seat {
  id: number;
  showId: string;
  seatNumber: string;
  rowLabel: string;
  tier: SeatTier;
  basePrice: number;
  status: SeatStatus;
  lockedBy: number | null;
  lockedUntil: string | null;
  metadata?: {
    blockId?: number;
    [key: string]: any;
  };
}

export type SeatTier = "CLASSIC" | "PRIME" | "PREMIUM" | "VIP";
export type SeatStatus = "AVAILABLE" | "LOCKED" | "BOOKED" | "SELECTED";

export interface BookingRequest {
  showId: string;
  seatIds: number[];
  cardLastFour: string;
  cardType: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardType: "VISA" | "MASTERCARD" | "AMEX" | null;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolderName: string;
  saveCard: boolean;
}

export interface SavedCard {
  id: number;
  cardType: string;
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  cardHolderName: string;
}
