// Theater and Show related types
export interface Theater {
  id: string;
  name: string;
  city: string;
  address: string;
  pincode: string;
  latitude: number;
  longitude: number;
  facilities: string[];
  screens: Screen[];
}

export interface Screen {
  screenId: string;
  name: string;
  formats: string[];
  seatLayout: SeatLayout;
}

export interface SeatLayout {
  rows: number;
  seatsPerRow: number[];
  tierMapping: TierMapping;
}

export interface TierMapping {
  classicRows: number[];
  primeRows: number[];
  premiumRows: number[];
  vipRows: number[];
}

export interface Show {
  id: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  showDate: string;
  showTime: string;
  format: string;
  language: string;
  basePrices: Record<string, number>;
  isActive: boolean;
  movieTitle: string;
  moviePosterUrl: string;
  theaterName: string;
  theaterCity: string;
}
