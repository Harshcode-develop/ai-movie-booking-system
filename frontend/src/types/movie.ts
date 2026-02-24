// Movie related types
export interface Movie {
  id: string;
  title: string;
  description: string;
  genres: string[];
  languages: string[];
  formats: MovieFormat[];
  duration: number;
  releaseDate: string;
  certificate: string;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  cast: CastMember[];
  crew: CrewMember[];
  rating: Rating;
  formatPremiums: Record<string, number>;
  isComingSoon?: boolean;
}

export type MovieFormat =
  | "IMAX_2D"
  | "IMAX_3D"
  | "FOUR_DX"
  | "STANDARD_2D"
  | "STANDARD_3D"
  | "DOLBY_ATMOS";

export interface CastMember {
  name: string;
  role: string;
  characterName: string;
  imageUrl: string;
}

export interface CrewMember {
  name: string;
  role: string;
}

export interface Rating {
  average: number;
  count: number;
}

export interface Review {
  id: string;
  movieId: string;
  userId: number;
  userName: string;
  rating: number;
  review: string;
  hashtags: string[];
  likes: number;
  createdAt: string;
  isVerifiedBooking: boolean;
}
