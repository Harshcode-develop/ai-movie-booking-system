import api from "./api";
import type { Movie, Review } from "../types";
import { mockMovies } from "../data/mockData";
import { comingSoonMovies } from "../data/comingSoonData";

export const allMovies = [...mockMovies, ...comingSoonMovies];

export const movieService = {
  getAll: async (): Promise<Movie[]> => {
    try {
      const response = await api.get<Movie[]>("/movies");
      return response.data.length > 0 ? response.data : allMovies;
    } catch (error) {
      console.warn("API getAll failed, using mock data", error);
      return allMovies;
    }
  },

  getById: async (id: string): Promise<Movie> => {
    try {
      const response = await api.get<Movie>(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`API getById(${id}) failed, searching mock data`, error);
      const mockMovie = allMovies.find((m) => m.id === id);
      if (mockMovie) return mockMovie;
      throw error;
    }
  },

  search: async (params: {
    title?: string;
    genre?: string;
    language?: string;
  }): Promise<Movie[]> => {
    try {
      const response = await api.get<Movie[]>("/movies/search", { params });
      return response.data;
    } catch (error) {
      console.warn("API search failed", error);
      return [];
    }
  },

  getNowShowing: async (): Promise<Movie[]> => {
    try {
      const response = await api.get<Movie[]>("/movies/now-showing");
      return response.data.length > 0 ? response.data : mockMovies;
    } catch (error) {
      console.warn("API getNowShowing failed, using mock data", error);
      return mockMovies;
    }
  },

  getTopRated: async (minRating = 8.0): Promise<Movie[]> => {
    try {
      const response = await api.get<Movie[]>("/movies/top-rated", {
        params: { minRating },
      });
      return response.data.length > 0
        ? response.data
        : mockMovies.filter((m) => (m.rating?.average || 0) >= minRating);
    } catch (error) {
      console.warn("API getTopRated failed, using mock data", error);
      return mockMovies.filter((m) => (m.rating?.average || 0) >= minRating);
    }
  },

  getComingSoon: async (): Promise<Movie[]> => {
    try {
      const response = await api.get<Movie[]>("/movies/coming-soon");
      return response.data.length > 0 ? response.data : comingSoonMovies;
    } catch (error) {
      console.warn("API getComingSoon failed, using mock data", error);
      return comingSoonMovies;
    }
  },

  // Reviews
  getReviews: async (
    movieId: string,
    page = 0,
    size = 10,
  ): Promise<{ content: Review[]; totalPages: number }> => {
    try {
      const response = await api.get(`/reviews/movie/${movieId}`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.warn("API getReviews failed", error);
      return { content: [], totalPages: 0 };
    }
  },

  getReviewStats: async (
    movieId: string,
  ): Promise<{ count: number; averageRating: number }> => {
    try {
      const response = await api.get(`/reviews/movie/${movieId}/stats`);
      return response.data;
    } catch (error) {
      console.warn("API getReviewStats failed", error);
      return { count: 0, averageRating: 0 };
    }
  },

  postReview: async (
    movieId: string,
    data: { rating: number; review: string; hashtags: string[] },
  ): Promise<Review> => {
    const response = await api.post<Review>(`/reviews/movie/${movieId}`, data);
    return response.data;
  },

  likeReview: async (reviewId: string): Promise<Review> => {
    const response = await api.put<Review>(`/reviews/${reviewId}/like`);
    return response.data;
  },
};
