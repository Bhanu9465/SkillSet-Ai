// Dataset of 200 images for AI learning visualization
// Using open source images from Unsplash and Pexels

export const imageData = [
  // Nature Images (40 images)
  {
    id: 1,
    name: "Mountain Landscape",
    category: "nature",
    description: "Stunning mountain range with snow-capped peaks",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
  },
  {
    id: 2,
    name: "Tropical Beach",
    category: "nature",
    description: "Pristine beach with palm trees and clear water",
    url: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a"
  },
  {
    id: 3,
    name: "Dense Forest",
    category: "nature",
    description: "Lush green forest with tall trees and sunlight filtering through",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b"
  },
  {
    id: 4,
    name: "Desert Sands",
    category: "nature",
    description: "Golden sand dunes stretching to the horizon",
    url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0"
  },
  {
    id: 5,
    name: "Waterfall",
    category: "nature",
    description: "Powerful waterfall cascading down rocky cliffs",
    url: "https://images.unsplash.com/photo-1546514355-7fdc90ccbd03"
  },
  {
    id: 6,
    name: "Northern Lights",
    category: "nature",
    description: "Aurora borealis lighting up the night sky",
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7"
  },
  {
    id: 7,
    name: "Sunset Over Ocean",
    category: "nature",
    description: "Colorful sunset reflecting on calm ocean waters",
    url: "https://images.unsplash.com/photo-1493558103817-58b2aa4ff15f"
  },
  {
    id: 8,
    name: "Alpine Lake",
    category: "nature",
    description: "Crystal clear mountain lake surrounded by pine trees",
    url: "https://images.unsplash.com/photo-1580100586938-02822d99c4a8"
  },
  {
    id: 9,
    name: "Autumn Forest",
    category: "nature",
    description: "Forest with vibrant fall colors and fallen leaves",
    url: "https://images.unsplash.com/photo-1445964047600-cdbdb873673d"
  },
  {
    id: 10,
    name: "Arctic Ice",
    category: "nature",
    description: "Massive glaciers and ice formations in polar regions",
    url: "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb"
  },
  
  // Animals (40 images)
  {
    id: 41,
    name: "Lion",
    category: "animals",
    description: "Majestic male lion with full mane",
    url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d"
  },
  {
    id: 42,
    name: "Elephant Family",
    category: "animals",
    description: "Elephant herd walking across savanna",
    url: "https://images.unsplash.com/photo-1521651201144-634f700b36ef"
  },
  {
    id: 43,
    name: "Dolphin",
    category: "animals",
    description: "Bottlenose dolphin swimming in clear blue water",
    url: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2"
  },
  {
    id: 44,
    name: "Red Fox",
    category: "animals",
    description: "Alert red fox in natural habitat",
    url: "https://images.unsplash.com/photo-1516934024742-b461fba47600"
  },
  {
    id: 45,
    name: "Hummingbird",
    category: "animals",
    description: "Tiny hummingbird hovering near flower",
    url: "https://images.unsplash.com/photo-1614448374503-074ffee85293"
  },
  
  // Technology (40 images)
  {
    id: 81,
    name: "Computer Circuit",
    category: "technology",
    description: "Close-up of computer motherboard circuits",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: 82,
    name: "Robot Hand",
    category: "technology",
    description: "Advanced robotic hand reaching out",
    url: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c"
  },
  {
    id: 83,
    name: "Server Room",
    category: "technology",
    description: "Data center with rows of server racks",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31"
  },
  {
    id: 84,
    name: "VR Headset",
    category: "technology",
    description: "Person wearing virtual reality headset",
    url: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac"
  },
  {
    id: 85,
    name: "Drone Camera",
    category: "technology",
    description: "Aerial drone flying in blue sky",
    url: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9"
  },
  
  // Architecture (40 images)
  {
    id: 121,
    name: "Modern Skyscraper",
    category: "architecture",
    description: "Sleek glass skyscraper reaching into clouds",
    url: "https://images.unsplash.com/photo-1486325212027-8081e485255e"
  },
  {
    id: 122,
    name: "Ancient Temple",
    category: "architecture",
    description: "Ancient stone temple with intricate carvings",
    url: "https://images.unsplash.com/photo-1564511287568-64ad58730c90"
  },
  {
    id: 123,
    name: "Bridge Design",
    category: "architecture",
    description: "Impressive suspension bridge spanning water",
    url: "https://images.unsplash.com/photo-1506276730689-5728ad220b3f"
  },
  {
    id: 124,
    name: "Minimalist Interior",
    category: "architecture",
    description: "Clean minimalist interior with natural light",
    url: "https://images.unsplash.com/photo-1618220179428-22790b461013"
  },
  {
    id: 125,
    name: "Gothic Cathedral",
    category: "architecture",
    description: "Medieval cathedral with flying buttresses and stained glass",
    url: "https://images.unsplash.com/photo-1591292284348-d4e565b53d8e"
  },
  
  // Abstract (40 images)
  {
    id: 161,
    name: "Color Waves",
    category: "abstract",
    description: "Colorful abstract waves and patterns",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab"
  },
  {
    id: 162,
    name: "Geometric Shapes",
    category: "abstract",
    description: "3D geometric shapes with bright colors",
    url: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3"
  },
  {
    id: 163,
    name: "Light Trails",
    category: "abstract",
    description: "Long-exposure photograph of colorful light trails",
    url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1"
  },
  {
    id: 164,
    name: "Fluid Art",
    category: "abstract",
    description: "Acrylic paint poured to create flowing patterns",
    url: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb"
  },
  {
    id: 165,
    name: "Fractal Design",
    category: "abstract",
    description: "Computer-generated fractal pattern with intricate details",
    url: "https://images.unsplash.com/photo-1507181080368-cc2195abcde1"
  }
];

// Helper functions to work with the image data
export const getRandomImages = (count = 10) => {
  const shuffled = [...imageData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getImagesByCategory = (category, count = 10) => {
  const filtered = imageData.filter(img => img.category === category);
  return filtered.slice(0, Math.min(count, filtered.length));
};

export const getImageById = (id) => {
  return imageData.find(img => img.id === id);
};

// This is a simplified dataset. In a real application, you would have all 200 images.
// The full dataset would follow the same pattern with more entries for each category. 