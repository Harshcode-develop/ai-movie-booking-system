import type { Movie } from "../types";
import { mockMovies } from "./mockData";

export const trendingMovies: Movie[] = mockMovies.filter((movie) =>
  ["3", "4", "6"].includes(movie.id),
);
