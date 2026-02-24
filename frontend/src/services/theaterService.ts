import api from "./api";
import type { Theater, Show } from "../types";

export const theaterService = {
  getTheatersByMovie: async (
    movieId: string,
    date: string,
    city: string,
  ): Promise<Theater[]> => {
    const response = await api.get<Theater[]>(`/theaters/movie/${movieId}`, {
      params: { date, city },
    });
    return response.data;
  },

  getShows: async (movieId: string, date: string): Promise<Show[]> => {
    const response = await api.get<Show[]>(`/shows/movie/${movieId}`, {
      params: { date },
    });
    return response.data;
  },

  getShowById: async (showId: string): Promise<Show> => {
    const response = await api.get<Show>(`/shows/${showId}`);
    return response.data;
  },

  getTheaterById: async (id: string): Promise<Theater> => {
    const response = await api.get<Theater>(`/theaters/${id}`);
    return response.data;
  },
};
