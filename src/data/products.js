// Categories and Products Data
export const categories = [
  {
    id: "motivation",
    name: "Motivation",
    image: "/Motivation/3.jpg",
    description: "Inspiring motivational posters"
  },
  {
    id: "nike",
    name: "Brands",
    image: "/Nike/2.jpg", 
    description: "Brands posters"
  },
  {
    id: "player-vibes",
    name: "Player Vibes",
    image: "/Player Vibes/4.jpg",
    description: "Sports players posters"
  },
  {
    id: "club-logos",
    name: "Club Logos",
    image: "/Club Logos/5.jpg",
    description: "Sports club logos"
  },
  {
    id: "careers",
    name: "Careers",
    image: "/Careers/2.jpg",
    description: "Career posters"
  },
  {
    id: "automotive",
    name: "Automotive",
    image: "/Automotive/3.jpg",
    description: "Car posters"
  },
  {
    id: "series-movies",
    name: "Series & Movies",
    image: "/Series & Movie/3.jpg",
    description: "Series & Movies posters"
  },
  {
    id: "q1",
    name: "Arabian Design",
    image: "/q 1/1.jpg",
    description: "Q1 section posters"
  },
  {
    id: "q2", 
    name: "Quran",
    image: "/q 2/2.jpg",
    description: "Q2 section posters"
  },
  {
    id: "another-poster",
    name: "Another Posters",
    image: "/Another Poster/1.jpg",
    description: "Various posters collection"
  }
];

// Products data - will be updated based on actual images in each folder
export const products = [
  // Motivation Category
  {
    id: "motivation-1",
    categoryId: "motivation",
    name: "Never Give Up",
    price: 280,
    image: "/Motivation/1.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "motivation-2", 
    categoryId: "motivation",
    name: " Start Now ",
    price: 280,
    image: "/Motivation/2.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "motivation-3", 
    categoryId: "motivation",
    name: "Success Is A Choice",
    price: 280,
    image: "/Motivation/3.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "motivation-4", 
    categoryId: "motivation",
    name: " Think Positive ",
    price: 280,
    image: "/Motivation/4.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "motivation-5", 
    categoryId: "motivation",
    name: " You Can Do It ",
    price: 280,
    image: "/Motivation/5.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "motivation-6", 
    categoryId: "motivation",
    name: " Keep Trying ",
    price: 280,
    image: "/Motivation/6.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "motivation-7", 
    categoryId: "motivation",
    name: " Dream Big ",
    price: 280,
    image: "/Motivation/7.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "motivation-8", 
    categoryId: "motivation",
    name: "Create Your Future",
    price: 280,
    image: "/Motivation/8.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "motivation-9", 
    categoryId: "motivation",
    name: "Believe In Yourself ",
    price: 280,
    image: "/Motivation/9.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "motivation-10", 
    categoryId: "motivation",
    name: "Every Day Is A New Chance",
    price: 280,
    image: "/Motivation/10.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },

  // Nike Category
  {
    id: "nike-1",
    categoryId: "nike", 
    name: "Nike",
    price: 280,
    image: "/Nike/1.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "nike-2",
    categoryId: "nike", 
    name: "Nike",
    price: 280,
    image: "/Nike/2.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "nike-3",
    categoryId: "nike", 
    name: "Nike",
    price: 280,
    image: "/Nike/3.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "nike-4",
    categoryId: "nike", 
    name: "Nike",
    price: 280,
    image: "/Nike/4.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "nike-5",
    categoryId: "nike", 
    name: "Nike",
    price: 280,
    image: "/Nike/5.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "nike-6",
    categoryId: "nike", 
    name: "Adidas",
    price: 280,
    image: "/Nike/6.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "nike-7",
    categoryId: "nike", 
    name: "Nike",
    price: 280,
    image: "/Nike/7.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "nike-8",
    categoryId: "nike", 
    name: "Nike",
    price: 280,
    image: "/Nike/8.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },

  // Player Vibes Category
  {
    id: "player-vibes-1",
    categoryId: "player-vibes",
    name: "Salah", 
    price: 280,
    image: "/Player Vibes/1.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-2",
    categoryId: "player-vibes",
    name: "Salah", 
    price: 280,
    image: "/Player Vibes/2.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-3",
    categoryId: "player-vibes",
    name: "Salah", 
    price: 280,
    image: "/Player Vibes/3.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-4",
    categoryId: "player-vibes",
    name: "Salah", 
    price: 280,
    image: "/Player Vibes/4.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-5",
    categoryId: "player-vibes",
    name: "Ronaldo", 
    price: 280,
    image: "/Player Vibes/5.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-6",
    categoryId: "player-vibes",
    name: "Ronaldo", 
    price: 280,
    image: "/Player Vibes/6.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-7",
    categoryId: "player-vibes",
    name: "Ronaldo", 
    price: 280,
    image: "/Player Vibes/7.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-8",
    categoryId: "player-vibes",
    name: "Ronaldo", 
    price: 280,
    image: "/Player Vibes/8.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-9",
    categoryId: "player-vibes",
    name: "Ronaldo", 
    price: 280,
    image: "/Player Vibes/9.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-10",
    categoryId: "player-vibes",
    name: "Ronaldo", 
    price: 280,
    image: "/Player Vibes/10.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-11",
    categoryId: "player-vibes",
    name: "Messi", 
    price: 280,
    image: "/Player Vibes/11.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-12",
    categoryId: "player-vibes",
    name: "Messi", 
    price: 280,
    image: "/Player Vibes/12.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-13",
    categoryId: "player-vibes",
    name: "Messi", 
    price: 280,
    image: "/Player Vibes/13.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-14",
    categoryId: "player-vibes",
    name: "Messi", 
    price: 280,
    image: "/Player Vibes/14.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-15",
    categoryId: "player-vibes",
    name: "Messi", 
    price: 280,
    image: "/Player Vibes/15.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-16",
    categoryId: "player-vibes",
    name: "Bellenighm", 
    price: 280,
    image: "/Player Vibes/16.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-17",
    categoryId: "player-vibes",
    name: "Palmer", 
    price: 280,
    image: "/Player Vibes/17.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-18",
    categoryId: "player-vibes",
    name: "Cristiano Ronaldo", 
    price: 280,
    image: "/Player Vibes/18.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-19",
    categoryId: "player-vibes",
    name: "Cristiano Ronaldo", 
    price: 280,
    image: "/Player Vibes/19.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-20",
    categoryId: "player-vibes",
    name: "Cristiano Ronaldo", 
    price: 280,
    image: "/Player Vibes/20.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-21",
    categoryId: "player-vibes",
    name: "Cristiano Ronaldo", 
    price: 280,
    image: "/Player Vibes/21.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-22",
    categoryId: "player-vibes",
    name: "Leo Messi", 
    price: 280,
    image: "/Player Vibes/22.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-23",
    categoryId: "player-vibes",
    name: "Mahmoud SK", 
    price: 280,
    image: "/Player Vibes/23.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-24",
    categoryId: "player-vibes",
    name: "Mohamed Salah", 
    price: 280,
    image: "/Player Vibes/24.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-25",
    categoryId: "player-vibes",
    name: "Omar Marmoush", 
    price: 280,
    image: "/Player Vibes/25.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-26",
    categoryId: "player-vibes",
    name: "RH", 
    price: 280,
    image: "/Player Vibes/26.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "player-vibes-27",
    categoryId: "player-vibes",
    name: "Messi", 
    price: 280,
    image: "/Player Vibes/27.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },

  // Club Logos Category
  {
    id: "club-logos-1",
    categoryId: "club-logos",
    name: "Arsenal F.C",
    price: 280,
    image: "/Club Logos/1.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-2",
    categoryId: "club-logos",
    name: "Al Ahly",
    price: 280,
    image: "/Club Logos/2.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-3",
    categoryId: "club-logos",
    name: "Manchester United",
    price: 280,
    image: "/Club Logos/3.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-4",
    categoryId: "club-logos",
    name: "AC Milan",
    price: 280,
    image: "/Club Logos/4.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-5",
    categoryId: "club-logos",
    name: "Liverpool F.C",
    price: 280,
    image: "/Club Logos/5.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-6",
    categoryId: "club-logos",
    name: "Barcelona F.C",
    price: 280,
    image: "/Club Logos/6.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-7",
    categoryId: "club-logos",
    name: "Inter Milan",
    price: 280,
    image: "/Club Logos/7.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-8",
    categoryId: "club-logos",
    name: "Al Ahly",
    price: 280,
    image: "/Club Logos/8.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-9",
    categoryId: "club-logos",
    name: "Al Ahly",
    price: 280,
    image: "/Club Logos/9.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-10",
    categoryId: "club-logos",
    name: "Real Madrid",
    price: 280,
    image: "/Club Logos/10.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-11",
    categoryId: "club-logos",
    name: "Juventus",
    price: 280,
    image: "/Club Logos/11.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-12",
    categoryId: "club-logos",
    name: "Arsenal",
    price: 280,
    image: "/Club Logos/12.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-13",
    categoryId: "club-logos",
    name: "Real Madrid",
    price: 280,
    image: "/Club Logos/13.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-14",
    categoryId: "club-logos",
    name: "Real Madrid",
    price: 280,
    image: "/Club Logos/14.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "club-logos-15",
    categoryId: "club-logos",
    name: "Elzamalek F.C",
    price: 280,
    image: "/Club Logos/15.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },

  // Careers Category
  {
    id: "careers-1",
    categoryId: "careers",
    name: "1",
    price: 280,
    image: "/Careers/1.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-2",
    categoryId: "careers",
    name: "2",
    price: 280,
    image: "/Careers/2.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-3",
    categoryId: "careers",
    name: "3",
    price: 280,
    image: "/Careers/3.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-4",
    categoryId: "careers",
    name: "4",
    price: 280,
    image: "/Careers/4.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-5",
    categoryId: "careers",
    name: "5",
    price: 280,
    image: "/Careers/5.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-6",
    categoryId: "careers",
    name: "6",
    price: 280,
    image: "/Careers/6.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-7",
    categoryId: "careers",
    name: "7",
    price: 280,
    image: "/Careers/7.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-8",
    categoryId: "careers",
    name: "8",
    price: 280,
    image: "/Careers/8.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-9",
    categoryId: "careers",
    name: "9",
    price: 280,
    image: "/Careers/9.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-10",
    categoryId: "careers",
    name: "10",
    price: 280,
    image: "/Careers/10.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-11",
    categoryId: "careers",
    name: "11",
    price: 280,
    image: "/Careers/11.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-12",
    categoryId: "careers",
    name: "12",
    price: 280,
    image: "/Careers/12.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "careers-13",
    categoryId: "careers",
    name: "13",
    price: 280,
    image: "/Careers/13.jpg", 
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  

  // Automotive Category
  {
    id: "automotive-1",
    categoryId: "automotive",
    name: "Porsche 911",
    price: 280,
    image: "/Automotive/1.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-2",
    categoryId: "automotive",
    name: "Porsche 911 GT3",
    price: 280,
    image: "/Automotive/2.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-3",
    categoryId: "automotive",
    name: "BMW E30 M3",
    price: 280,
    image: "/Automotive/3.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-4",
    categoryId: "automotive",
    name: "Porsche",
    price: 280,
    image: "/Automotive/4.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-5",
    categoryId: "automotive",
    name: "Porsche",
    price: 280,
    image: "/Automotive/5.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-6",
    categoryId: "automotive",
    name: "Koenigsegg Agera RS",
    price: 280,
    image: "/Automotive/6.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-7",
    categoryId: "automotive",
    name: "Koenigsegg Agera RS",
    price: 280,
    image: "/Automotive/7.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-8",
    categoryId: "automotive",
    name: "Koenigsegg Jesko",
    price: 280,
    image: "/Automotive/8.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-9",
    categoryId: "automotive",
    name: "Ferrari F1",
    price: 280,
    image: "/Automotive/9.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-10",
    categoryId: "automotive",
    name: "Porsche 911 GT3 RS",
    price: 280,
    image: "/Automotive/10.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-11",
    categoryId: "automotive",
    name: "Porsche 911 GT3 RS",
    price: 280,
    image: "/Automotive/11.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-12",
    categoryId: "automotive",
    name: "Toyota Supra",
    price: 280,
    image: "/Automotive/12.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-13",
    categoryId: "automotive",
    name: "Toyota Supra",
    price: 280,
    image: "/Automotive/13.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-14",
    categoryId: "automotive",
    name: "Porsche 911 GT3 RS",
    price: 280,
    image: "/Automotive/14.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-15",
    categoryId: "automotive",
    name: "Porsche 911 GT3 RS",
    price: 280,
    image: "/Automotive/15.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-16",
    categoryId: "automotive",
    name: "Mclaren 765S",
    price: 280,
    image: "/Automotive/16.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-17",
    categoryId: "automotive",
    name: "BMW M8 Competition",
    price: 280,
    image: "/Automotive/17.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-18",
    categoryId: "automotive",
    name: "Mercedes-Benz AMG GT",
    price: 280,
    image: "/Automotive/18.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-19",
    categoryId: "automotive",
    name: "Mercedes-Benz AMG GT S",
    price: 280,
    image: "/Automotive/19.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "automotive-20",
    categoryId: "automotive",
    name: "Porsche 911 GT3 RS",
    price: 280,
    image: "/Automotive/20.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },

  // Series & Movies Category
  {
    id: "series-movies-1",
    categoryId: "series-movies",
    name: "Better Call Saul",
    price: 280,
    image: "/Series & Movie/1.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "series-movies-2",
    categoryId: "series-movies",
    name: "Fight Club",
    price: 280,
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    image: "/Series & Movie/2.jpg",
    inStock: true
  },
  {
    id: "series-movies-3",
    categoryId: "series-movies",
    name: "GodFather",
    price: 280,
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    image: "/Series & Movie/3.jpg",
    inStock: true
  },
  {
    id: "series-movies-4",
    categoryId: "series-movies",
    name: "inception",
    price: 280,
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    image: "/Series & Movie/4.jpg",
    inStock: true
  },
  {
    id: "series-movies-5",
    categoryId: "series-movies",
    name: "interstellar",
    price: 280,
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    image: "/Series & Movie/5.jpg",
    inStock: true
  },
  {
    id: "series-movies-6",
    categoryId: "series-movies",
    name: "prison break",
    price: 280,
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    image: "/Series & Movie/6.jpg",
    inStock: true
  },
  {
    id: "series-movies-7",
    categoryId: "series-movies",
    name: "seven",
    price: 280,
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    image: "/Series & Movie/7.jpg",
    inStock: true
  },


  // Q1 Category
  {
    id: "q1-1",
    categoryId: "q1",
    name: "1", 
    price: 280,
    image: "/q 1/1.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q1-2",
    categoryId: "q1",
    name: "2", 
    price: 280,
    image: "/q 1/2.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q1-3",
    categoryId: "q1",
    name: "3", 
    price: 280,
    image: "/q 1/3.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q1-4",
    categoryId: "q1",
    name: "4", 
    price: 280,
    image: "/q 1/4.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q1-5",
    categoryId: "q1",
    name: "5", 
    price: 280,
    image: "/q 1/5.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q1-6",
    categoryId: "q1",
    name: "6", 
    price: 280,
    image: "/q 1/6.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q1-7",
    categoryId: "q1",
    name: "7", 
    price: 280,
    image: "/q 1/7.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q1-8",
    categoryId: "q1",
    name: "8", 
    price: 280,
    image: "/q 1/8.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q1-9",
    categoryId: "q1",
    name: "9", 
    price: 280,
    image: "/q 1/9.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },

  // Q2 Category
  {
    id: "q2-1",
    categoryId: "q2",
    name: "1",
    price: 280, 
    image: "/q 2/1.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q2-2",
    categoryId: "q2",
    name: "2",
    price: 280, 
    image: "/q 2/2.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q2-3",
    categoryId: "q2",
    name: "3",
    price: 280, 
    image: "/q 2/3.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q2-4",
    categoryId: "q2",
    name: "4",
    price: 280, 
    image: "/q 2/4.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q2-5",
    categoryId: "q2",
    name: "5",
    price: 280, 
    image: "/q 2/5.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q2-6",
    categoryId: "q2",
    name: "6",
    price: 280, 
    image: "/q 2/6.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q2-7",
    categoryId: "q2",
    name: "7",
    price: 280, 
    image: "/q 2/7.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q2-8",
    categoryId: "q2",
    name: "8",
    price: 280, 
    image: "/q 2/8.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q2-9",
    categoryId: "q2",
    name: "9",
    price: 280, 
    image: "/q 2/9.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "q2-10",
    categoryId: "q2",
    name: "10",
    price: 280, 
    image: "/q 2/10.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },

  // Another Poster Category
  {
    id: "another-poster-1",
    categoryId: "another-poster",
    name: "1",
    price: 280,
    image: "/Another Poster/1.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-2",
    categoryId: "another-poster",
    name: "2",
    price: 280,
    image: "/Another Poster/2.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-3",
    categoryId: "another-poster",
    name: "3",
    price: 280,
    image: "/Another Poster/3.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-4",
    categoryId: "another-poster",
    name: "4",
    price: 280,
    image: "/Another Poster/4.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-5",
    categoryId: "another-poster",
    name: "5",
    price: 280,
    image: "/Another Poster/5.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-6",
    categoryId: "another-poster",
    name: "6",
    price: 280,
    image: "/Another Poster/6.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-7",
    categoryId: "another-poster",
    name: "7",
    price: 280,
    image: "/Another Poster/7.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-8",
    categoryId: "another-poster",
    name: "8",
    price: 280,
    image: "/Another Poster/8.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-9",
    categoryId: "another-poster",
    name: "9",
    price: 280,
    image: "/Another Poster/9.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-10",
    categoryId: "another-poster",
    name: "10",
    price: 280,
    image: "/Another Poster/10.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-11",
    categoryId: "another-poster",
    name: "11",
    price: 280,
    image: "/Another Poster/11.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-12",
    categoryId: "another-poster",
    name: "12",
    price: 280,
    image: "/Another Poster/12.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-13",
    categoryId: "another-poster",
    name: "13",
    price: 280,
    image: "/Another Poster/13.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-14",
    categoryId: "another-poster",
    name: "14",
    price: 280,
    image: "/Another Poster/14.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-15",
    categoryId: "another-poster",
    name: "15",
    price: 280,
    image: "/Another Poster/15.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
  {
    id: "another-poster-16",
    categoryId: "another-poster",
    name: "16",
    price: 280,
    image: "/Another Poster/16.jpg",
    sizes: [
      { name: "Small", price: 230, dimensions: "20x30 cm" },
      { name: "Medium", price: 280, dimensions: "30x40 cm" },
      { name: "Large", price: 370, dimensions: "40x50 cm" }
    ],
    inStock: true
  },
];

// Helper functions
export const getProductsByCategory = (categoryId) => {
  return products.filter(product => product.categoryId === categoryId);
};

export const getProductById = (productId) => {
  return products.find(product => product.id === productId);
};

export const getCategoryById = (categoryId) => {
  return categories.find(category => category.id === categoryId);
}; 