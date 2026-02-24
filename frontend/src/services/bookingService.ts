import api from "./api";
import type { Booking, BookingRequest, Seat } from "../types";

export const bookingService = {
  getSeats: async (showId: string): Promise<Seat[]> => {
    const response = await api.get<Seat[]>(`/bookings/seats/${showId}`);
    return response.data;
  },

  getAvailableSeats: async (showId: string): Promise<Seat[]> => {
    const response = await api.get<Seat[]>(
      `/bookings/seats/${showId}/available`,
    );
    return response.data;
  },

  getSeatCount: async (showId: string): Promise<Record<string, number>> => {
    const response = await api.get<Record<string, number>>(
      `/bookings/seats/${showId}/count`,
    );
    return response.data;
  },

  lockSeats: async (seatIds: number[]): Promise<Seat[]> => {
    const response = await api.post<Seat[]>("/bookings/lock", seatIds);
    return response.data;
  },

  completeBooking: async (data: BookingRequest): Promise<Booking> => {
    const response = await api.post<Booking>("/bookings/complete", data);
    return response.data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>("/bookings/my-bookings");
    return response.data;
  },

  getMyTickets: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>("/bookings/my-tickets");
    return response.data;
  },
};
