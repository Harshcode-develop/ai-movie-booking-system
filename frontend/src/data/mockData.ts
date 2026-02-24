import type { Movie, Review } from "../types";

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Interstellar: The IMAX Experience",
    description:
      "A team of explorers travel beyond this galaxy through a newly discovered wormhole to discover whether mankind has a future among the stars.",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    languages: ["English", "Hindi"],
    formats: ["IMAX_3D", "IMAX_2D", "DOLBY_ATMOS"],
    duration: 169,
    releaseDate: "2024-11-07",
    certificate: "PG-13",
    posterUrl:
      "https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/interstellar-et00019066-19-02-2021-02-25-12.jpg",
    bannerUrl:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&h=1080&fit=crop",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    cast: [
      {
        name: "Matthew McConaughey",
        role: "Joseph Cooper",
        imageUrl:
          "https://in.bmscdn.com/iedb/artist/images/website/poster/large/matthew-mcconaughey-4593-1648122667.jpg",
        characterName: "",
      },
      {
        name: "Anne Hathaway",
        role: "Dr. Amelia Brand",
        imageUrl:
          "https://in.bmscdn.com/iedb/artist/images/website/poster/large/anne-hathaway-191-10-10-2016-06-21-51.jpg",
        characterName: "",
      },
      {
        name: "Jessica Chastain",
        role: "Murph",
        imageUrl:
          "https://in.bmscdn.com/iedb/artist/images/website/poster/large/jessica-chastain-21962-24-03-2017-17-30-03.jpg",
        characterName: "",
      },
      {
        name: "Wes Bentley",
        role: "Doyle",
        imageUrl:
          "https://in.bmscdn.com/iedb/artist/images/website/poster/large/wes-bentley-22148-24-03-2017-12-37-54.jpg",
        characterName: "",
      }
    ],
    crew: [],
    rating: { average: 9.2, count: 15420 },
    formatPremiums: {},
  },
  {
    id: "2",
    title: "Avatar: The Way of Water",
    description:
      "Dive back into Pandora`s oceans with Jake, Neytiri, and their family in James Cameron`s breathtaking epic. With remastered visuals, heart-pounding action, and unmatched scale, Avatar: The Way of Water is not just a movie, it`s an event you must experience again, only on the big screen in cinemas October 2nd!" +
      "" +
      "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family (Jake, Neytiri and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive and the tragedies they endure.",
    genres: ["Action", "Sci-Fi", "Adventure"],
    languages: ["English", "Hindi"],
    formats: ["IMAX_3D", "FOUR_DX", "STANDARD_3D"],
    duration: 192,
    releaseDate: "2023-12-16",
    certificate: "PG-13",
    posterUrl:
      "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/avatar-the-way-of-water-et00037264-1670850986.jpg",
    bannerUrl:
      "https://survi.in/wp-content/uploads/2022/12/Avatar-2-Review-1024x512.jpeg",
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    cast: [
      {
        name: "Sam Worthington",
        role: "Jake Sully",
        imageUrl: 
            "https://in.bmscdn.com/iedb/artist/images/website/poster/large/sam-worthington-12089-24-03-2017-12-32-07.jpg",
        characterName: ""
      },
      {
        name: "Zoe Saldana",
        role: "Neytiri",
        imageUrl: 
            "https://in.bmscdn.com/iedb/artist/images/website/poster/large/zoe-saldana-3261-13-10-2017-03-54-34.jpg",
        characterName: ""
      },
      {
        name: "Sigourney Weaver",
        role: "Grace",
        imageUrl: 
            "https://in.bmscdn.com/iedb/artist/images/website/poster/large/sigourney-weaver-3258-24-03-2017-17-32-08.jpg",
        characterName: ""
      },
      {
        name: "Stephen Lang",
        role: "Miles Quaritch",
        imageUrl: 
            "https://in.bmscdn.com/iedb/artist/images/website/poster/large/stephen-lang-15008-24-03-2017-12-44-36.jpg",
        characterName: ""
      },
      
    ],
    crew: [],
    rating: { average: 8.5, count: 12350 },
    formatPremiums: {},
  },
  {
    id: "3",
    title: "Avatar: Fire and Ash",
    description:
      "The biggest film in the world, the ultimate cinematic experience and spectacle, goes even bigger with Avatar: Fire and Ash. In the aftermath of great loss, Jake Sully and Neytiri confront a new and dangerous force on Pandora. As tensions rise, their family`s strength and unity are tested like never before.",
    genres: ["Adventure", "Action", "Fantasy", "Sci-Fi"],
    languages: ["English", "Hindi"],
    formats: ["IMAX_2D", "IMAX_3D", "DOLBY_ATMOS", "STANDARD_2D"],
    duration: 197,
    releaseDate: "2025-12-19",
    certificate: "UA16+",
    posterUrl:
      "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/avatar-fire-and-ash-et00407893-1765890770.jpg",
    bannerUrl:
      "https://roadtovrlive-5ea0.kxcdn.com/wp-content/uploads/2025/09/avatar-3.jpg",
    trailerUrl: "https://youtu.be/Ma1x7ikpid8?si=YxY1Xw7tH6XkMeLY",
    cast: [
       {
        name: "Sam Worthington",
        role: "Jake Sully",
        imageUrl: 
            "https://in.bmscdn.com/iedb/artist/images/website/poster/large/sam-worthington-12089-24-03-2017-12-32-07.jpg",
        characterName: ""
      },
      {
        name: "Zoe Saldana",
        role: "Neytiri",
        imageUrl: 
            "https://in.bmscdn.com/iedb/artist/images/website/poster/large/zoe-saldana-3261-13-10-2017-03-54-34.jpg",
        characterName: ""
      },
      {
        name: "Sigourney Weaver",
        role: "Grace",
        imageUrl: 
            "https://in.bmscdn.com/iedb/artist/images/website/poster/large/sigourney-weaver-3258-24-03-2017-17-32-08.jpg",
        characterName: ""
      },
      {
        name: "Stephen Lang",
        role: "Miles Quaritch",
        imageUrl: 
            "https://in.bmscdn.com/iedb/artist/images/website/poster/large/stephen-lang-15008-24-03-2017-12-44-36.jpg",
        characterName: ""
      },
    ],
    crew: [],
    rating: { average: 8.0, count: 18200 },
    formatPremiums: {},
  },
  {
    id: "4",
    title: "Zootopia 2",
    description:
      "Get ready to race back into the wild, colorful world of Zootopia, where animals talk, hustle, and chase their dreams - just like us! Whether you loved the first Zootopia or are diving in for the first time, this is one ride you don't want to miss!",
    genres: ["Animated", "Action", "Comedy"],
    languages: ["English", "Hindi"],
    formats: ["IMAX_2D", "IMAX_3D", "STANDARD_2D", "DOLBY_ATMOS"],
    duration: 108,
    releaseDate: "2025-11-21",
    certificate: "U",
    posterUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFdVnM5nAXtrkgOQyWvyriqHNaiOBfGLwH3A&s",
    bannerUrl:
      "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/44d994ac-3f6c-4d9d-8000-fd8f4bfc9cfc/compose?aspectRatio=1.78&format=webp&width=1200",
    trailerUrl: "https://youtu.be/5AwtptT8X8k",
    cast: [
      {
        name: "Jason Bateman",
        role: "Nick Wilde",
        imageUrl: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/jason-bateman-928-24-03-2017-12-33-06.jpg",
        characterName: ""
      },
      {
        name: "Ginnifer Goodwin",
        role: "Judy Hopps",
        imageUrl: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/ginnifer-goodwin-9894-24-03-2017-15-49-52.jpg",
        characterName: ""
      },
      {
        name: "Shakira",
        role: "Gazelle",
        imageUrl: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/shakira-1060934-24-03-2017-13-49-08.jpg",
        characterName: ""
      },
      {
        name: "Idris Elba",
        role: "Chief Bogo",
        imageUrl: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/idris-elba-845-24-03-2017-12-41-49.jpg",
        characterName: ""
      }
  
    ],
    crew: [],
    rating: { average: 9.1, count: 25600 },
    formatPremiums: {},
  },
 {
    id: "5",
    title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
    description:
      "The Demon Slayer Corps plunge into Infinity Castle to defeat Muzan. However, the remaining Hashiras and the Demon Slayers who survived Tanjiro's Final Selection are pitted against the remaining members of the Twelve Kizuki first.",
    genres: ["Action", "Adventure", "Anime"],
    languages: ["English", "Hindi"],
    formats: ["IMAX_2D", "STANDARD_2D", "DOLBY_ATMOS"],
    duration: 155,
    releaseDate: "2025-09-12",
    certificate: "UA13+",
    posterUrl:
      "https://animationxpress.com/wp-content/uploads/2025/07/DemonSlayerKimetsunoYaibaInfinityCastle_IMAX_DigitalPosters_US_EN_2x3_2000x3000-scaled.png",
    bannerUrl: "https://assets-in.bmscdn.com/discovery-catalog/events/et00436673-tblgvyewsq-landscape.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=wZ7Lytag8mE",
    cast: [
      {
        name: "Natsuki Hanae",
        role: "Tanjiro Kamado(Voice)",
        imageUrl: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/natsuki-hanae-2013838-12-08-2021-01-44-18.jpg",
        characterName: ""
      },
      {
        name: "Yoshitsugu Matsuoka",
        role: "Voice Actor",
        imageUrl: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/yoshitsugu-matsuoka-2013840-12-08-2021-01-54-26.jpg",
        characterName:""
      }
    ],
    crew: [],
    rating: { average: 8.4, count: 19800 },
    formatPremiums: {},
  },
   {
    id: "6",
    title: "F1: The Movie",
    description:
      "Sonny Hayes (Brad Pitt) was FORMULA 1`s most promising phenom of the 1990s until an accident on the track nearly ended his career. Thirty years later, he`s a nomadic racer-for-hire when he`s approached by his former teammate Ruben Cervantes (Javier Bardem), owner of a struggling FORMULA 1 team that is on the verge of collapse. Ruben convinces Sonny to come back to FORMULA 1 for one last shot at saving the team and being the best in the world. He`ll drive alongside Joshua Pearce (Damson Idris), the team`s hotshot rookie intent on setting his own pace. But as the engines roar, Sonny`s past catches up with him, and he finds that in FORMULA 1, your teammate is your fiercest competition-and the road to redemption is not something you can travel alone.",
    genres: ["Action", "Drama", "Sports"],
    languages: ["English", "Hindi"],
    formats: ["IMAX_2D", "IMAX_3D" ,"FOUR_DX", "DOLBY_ATMOS"],
    duration: 155,
    releaseDate: "2025-07-27",
    certificate: "UA16+",
    posterUrl:
      "https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2025/06/12131645/9PXZIUsSDh4alB80jheWX4fhZmy-683x1024.jpg",
    bannerUrl: "https://i.ytimg.com/vi/-38QwKyz82E/maxresdefault.jpg",
    trailerUrl: "https://youtu.be/8yh9BPUBbbQ?si=3YiCBgfB-cDsTW67",
    cast: [
      {
        name: "Brad Pitt",
        role: "Sonny Hayes",
        imageUrl: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/brad-pitt-345-24-03-2017-12-34-50.jpg",
        characterName: ""
      },
      {
        name: "Damson Idris",
        role: "Joshua Pearce",
        imageUrl: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/damson-idris-2038429-1720191196.jpg",
        characterName:""
      },
      {
        name: "Kerry Condon",
        role: "Kate McKenna",
        imageUrl: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/kerry-condon-2031456-1696674814.jpg",
        characterName:""
      }
    ],
    crew: [],
    rating: { average: 8.9, count: 19800 },
    formatPremiums: {},
  },
  
];

export const mockReviews: Review[] = [
  {
    id: "1",
    movieId: "1",
    userId: 101,
    userName: "Alice Johnson",
    rating: 9.5,
    review:
      "Absolutely mind-blowing visualization of black holes. The sound design in IMAX is just out of this world!",
    hashtags: ["#Masterpiece", "#Nolan", "#Space"],
    likes: 124,
    isVerifiedBooking: true,
    createdAt: "2023-11-10T14:30:00Z",
  },
  {
    id: "2",
    movieId: "1",
    userId: 102,
    userName: "Raj Patel",
    rating: 8,
    review: "A bit long but worth every minute. Emotional core is strong.",
    hashtags: ["#Emotional", "#SciFi"],
    likes: 45,
    isVerifiedBooking: true,
    createdAt: "2023-11-12T09:15:00Z",
  },
];
