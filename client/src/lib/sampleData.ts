import { collection, addDoc, getDocs, query } from './firebase';
import { db } from './firebase';
import { Product } from '../types';

export const sampleProducts: Partial<Omit<Product, 'id' | 'createdAt'>>[] = [
  {
    name: "Cute Animal Multi-Color Pens",
    title: "Cute Animal Multi-Color Pens",
    description: "Adorable animal-shaped multi-color pens with owl, avocado, flamingo, and pineapple designs. Perfect for kids' creative writing.",
    price: 12.99,
    originalPrice: 16.99,
    discount: 24,
    images: ["/images/candles/candle-collection-1.png"],
    category: "Kids Stationaries",
    stockQuantity: 30,
    features: ["Multiple colors", "Cute animal designs", "Child-safe materials", "Easy grip"],
    featured:   true,
  },
  {
    name: "Rainbow Sketch Pens Set",
    title: "Rainbow Sketch Pens Set",
    description: "Complete set of colorful sketch pens in a handy case. Perfect for school projects and creative artwork.",
    price: 16.99,
    originalPrice: 22.99,
    discount: 26,
    images: ["/images/candles/candle-collection-2.png"],
    category: "Kids Stationaries",
    stockQuantity: 25,
    features: ["36 vibrant colors", "Washable ink", "Storage case included", "Non-toxic"],
    featured:   true,
  },
  {
    name: "Complete Stationery Gift Set",
    title: "Complete Stationery Gift Set",
    description: "Comprehensive stationery set with cute bear characters. Includes rulers, scissors, glue stick, and various writing tools.",
    price: 24.99,
    originalPrice: 32.99,
    discount: 24,
    images: ["/images/candles/candle-collection-2.png"],
    category: "Kids Stationaries",
    stockQuantity: 20,
    features: ["Complete set", "Bear character theme", "All essential tools", "Gift packaging"],
    featured: true
  },
  {
    name: "Space Theme Fountain Pen Set",
    title: "Space Theme Fountain Pen Set",
    description: "Adorable space-themed fountain pen set with astronaut bear design. Includes erasable ink cartridges.",
    price: 18.99,
    originalPrice: 24.99,
    discount: 24,
    images: ["/images/candles/candle-collection-3.png"],
    category: "Kids Stationaries",
    stockQuantity: 25,
    features: ["Space theme", "Fountain pen design", "Erasable ink", "Kid-friendly"],
    featured: true
  },
  {
    name: "24-Color Twin Marker Set",
    title: "24-Color Twin Marker Set",
    description: "Professional-quality twin tip markers in 24 vibrant colors. Perfect for drawing, coloring, and art projects.",
    price: 19.99,
    originalPrice: 26.99,
    discount: 26,
    images: ["/images/candles/candle-collection-4.png"],
    category: "Kids Stationaries",
    stockQuantity: 35,
    features: ["24 colors", "Twin tips", "Vibrant colors", "Art quality"]
  },
  {
    name: "Fun Character Pencil Cases",
    title: "Fun Character Pencil Cases",
    description: "Cute character-themed pencil cases featuring space panda, space dinosaur, and astronaut designs.",
    price: 15.99,
    originalPrice: 21.99,
    discount: 27,
    images: ["/images/candles/candle-collection-5.png"],
    category: "Kids Stationaries",
    stockQuantity: 28,
    features: ["Character designs", "Spacious storage", "Durable material", "Kid-friendly"]
  },
  {
    name: "Rainbow Art Supplies Bundle",
    title: "Rainbow Art Supplies Bundle",
    description: "Complete art bundle with crayons, colored pencils, markers, and sketch pad. Perfect for creative expression.",
    price: 28.99,
    originalPrice: 36.99,
    discount: 22,
    images: ["/images/candles/candle-collection-6.jpg"],
    category: "Kids Stationaries",
    stockQuantity: 18,
    features: ["Complete art set", "Rainbow colors", "Sketch pad included", "Creative tools"]
  },
  {
    name: "School Essentials Starter Pack",
    title: "School Essentials Starter Pack",
    description: "Everything needed for school success including notebooks, pens, erasers, ruler, and pencil sharpener.",
    price: 21.99,
    originalPrice: 28.99,
    discount: 24,
    images: ["/images/candles/candle-collection-7.jpg"],
    category: "Kids Stationaries",
    stockQuantity: 32,
    features: ["School essentials", "Quality materials", "Organized pack", "Value bundle"]
  },
  {
    name: "Sacred Prayer Candle Set",
    title: "Sacred Prayer Candle Set",
    description: "Beautiful set of prayer candles for meditation and spiritual practices. Made with natural wax and blessed oils.",
    price: 34.99,
    originalPrice: 42.99,
    discount: 19,
    images: ["/images/candles/candle-collection-8.jpg"],
    category: "Religious Products",
    stockQuantity: 15,
    features: ["Prayer candles", "Natural wax", "Blessed oils", "Spiritual use"]
  },
  {
    name: "Meditation Incense Collection",
    title: "Meditation Incense Collection",
    description: "Premium incense sticks in sacred fragrances including sandalwood, frankincense, and myrrh for spiritual meditation.",
    price: 26.99,
    originalPrice: 34.99,
    discount: 23,
    images: ["/images/candles/candle-collection-9.jpg"],
    category: "Religious Products",
    stockQuantity: 22,
    features: ["Sacred fragrances", "Premium quality", "Meditation aid", "Spiritual wellness"]
  },
  {
    name: "Blessed Essential Oils Set",
    title: "Blessed Essential Oils Set",
    description: "Collection of blessed essential oils including lavender, rose, and sandalwood for spiritual healing and prayer.",
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    images: ["/images/candles/candle-collection-10.jpg"],
    category: "Religious Products",
    stockQuantity: 12,
    features: ["Blessed oils", "Spiritual healing", "Pure essentials", "Prayer enhancement"]
  },
  {
    name: "Sacred Oil Lamp",
    title: "Sacred Oil Lamp",
    description: "Traditional brass oil lamp for spiritual practices and religious ceremonies. Beautifully crafted for divine ambiance.",
    price: 35.00,
    originalPrice: 45.00,
    discount: 22,
    images: ["/images/candles/candle-collection-6.jpg"],
    category: "Religious Items",
    stockQuantity: 10,
    features: ["Brass construction", "Traditional design", "Spiritual practices", "Handcrafted"]
  },
  {
    name: "Sacred Prayer Beads",
    title: "Sacred Prayer Beads",
    description: "Handcrafted wooden prayer beads for meditation and spiritual practices. Made from sacred sandalwood.",
    price: 28.00,
    originalPrice: 35.00,
    discount: 20,
    images: ["/images/candles/candle-collection-7.jpg"],
    category: "Religious Items",
    stockQuantity: 15,
    features: ["Sandalwood beads", "Traditional count", "Meditation aid", "Blessed by priests"]
  },
  {
    name: "Temple Incense Set",
    title: "Temple Incense Set",
    description: "Premium incense sticks collection for meditation and worship. Includes jasmine, sandalwood, and rose varieties.",
    price: 28.50,
    originalPrice: 35.50,
    discount: 20,
    images: ["/images/candles/candle-collection-7.jpg"],
    category: "Religious Items",
    stockQuantity: 25,
    features: ["Multiple fragrances", "Long burning", "Natural ingredients", "Temple quality"]
  },
  {
    name: "Divine Prayer Candles",
    title: "Divine Prayer Candles",
    description: "Set of blessed prayer candles for spiritual meditation and divine connection. Made with pure wax and positive intentions.",
    price: 32.00,
    originalPrice: 40.00,
    discount: 20,
    images: ["/images/candles/candle-collection-8.jpg"],
    category: "Religious Items",
    stockQuantity: 18,
    features: ["Blessed candles", "Pure wax", "Meditation aid", "Spiritual connection"]
  },
  {
    name: "Premium Gift Box",
    title: "Premium Gift Box",
    description: "Elegant gift box containing a curated selection of premium items. Perfect for birthdays, anniversaries, and special occasions.",
    price: 65.00,
    originalPrice: 80.00,
    discount: 19,
    images: ["/images/candles/candle-collection-9.jpg"],
    category: "Gifts",
    stockQuantity: 15,
    features: ["Curated selection", "Premium packaging", "Special occasions", "Elegant presentation"]
  },
  {
    name: "Luxury Hamper Collection",
    title: "Luxury Hamper Collection",
    description: "Luxurious hamper with gourmet treats, premium candles, and elegant accessories. The perfect indulgent gift.",
    price: 85.00,
    originalPrice: 105.00,
    discount: 19,
    images: ["/images/candles/candle-collection-10.jpg"],
    category: "Gifts",
    stockQuantity: 8,
    features: ["Gourmet treats", "Premium items", "Luxury packaging", "Indulgent experience"]
  },
  {
    name: "Celebration Gift Set",
    title: "Celebration Gift Set",
    description: "Festive gift set perfect for celebrations and milestones. Includes decorative items and sweet treats.",
    price: 45.00,
    originalPrice: 58.00,
    discount: 22,
    images: ["/images/candles/candle-collection-1.png"],
    category: "Gifts",
    stockQuantity: 20,
    features: ["Festive theme", "Celebration ready", "Decorative items", "Sweet treats"]
  },
  {
    name: "Luxury Gradient Candles",
    title: "Luxury Gradient Candles",
    description: "Elegant ombre candles with beautiful red-to-white gradient. Perfect for romantic dinners and special occasions.",
    price: 45.99,
    originalPrice: 55.99,
    discount: 18,
    images: ["/images/candles/candle-collection-2.png"],
    category: "Scented Candles",
    stockQuantity: 15,
    features: ["Hand-dipped gradient", "Premium wax blend", "Romantic ambiance", "Long burn time"]
  },
  {
    name: "Vanilla Spice Warmth",
    title: "Vanilla Spice Warmth",
    description: "Warm and inviting vanilla spice candles that fill your space with cozy comfort. Perfect for autumn and winter evenings.",
    price: 38.99,
    originalPrice: 47.99,
    discount: 19,
    images: ["/images/candles/candle-collection-3.png"],
    category: "Scented Candles",
    stockQuantity: 30,
    features: ["Vanilla spice blend", "Cozy atmosphere", "Premium wax", "Long-lasting"]
  },
  {
    name: "Citrus Burst Energy",
    title: "Citrus Burst Energy",
    description: "Energizing citrus candles that invigorate your senses and brighten your day with zesty orange and lemon notes.",
    price: 41.99,
    originalPrice: 51.99,
    discount: 19,
    images: ["/images/candles/candle-collection-4.png"],
    category: "Scented Candles",
    stockQuantity: 28,
    features: ["Citrus blend", "Energizing scent", "Mood lifting", "Bright colors"]
  },
  {
    name: "French Lavender Elegance",
    title: "French Lavender Elegance",
    description: "Premium French lavender scented candles with sophisticated floral notes. Creates a serene and calming atmosphere.",
    price: 48.99,
    originalPrice: 58.99,
    discount: 17,
    images: ["/images/candles/candle-collection-5.png"],
    category: "Scented Candles",
    stockQuantity: 22,
    features: ["French lavender", "Sophisticated scent", "Calming atmosphere", "Premium quality"]
  },
  {
    name: "Natural Soy Wax Collection",
    title: "Natural Soy Wax Collection",
    description: "Clean-burning soy wax candles in elegant glass containers. Made with natural ingredients for a pure experience.",
    price: 38.99,
    originalPrice: 47.99,
    discount: 19,
    images: ["/images/candles/candle-collection-6.jpg"],
    category: "Soy Wax",
    stockQuantity: 20,
    features: ["100% natural soy wax", "Glass containers", "Clean burning", "Eco-friendly"]
  },
  {
    name: "Organic Soy Candle Trio",
    title: "Organic Soy Candle Trio",
    description: "Set of three organic soy candles in different calming scents. Environmentally conscious and long-lasting.",
    price: 44.99,
    originalPrice: 55.99,
    discount: 20,
    images: ["/images/candles/candle-collection-7.jpg"],
    category: "Soy Wax",
    stockQuantity: 18,
    features: ["Organic soy wax", "Three scents", "Eco-friendly", "Long burning"]
  },
  {
    name: "Minimalist Soy Wax Candles",
    title: "Minimalist Soy Wax Candles",
    description: "Clean, modern design soy wax candles perfect for contemporary homes. Subtle fragrances and elegant appearance.",
    price: 36.99,
    originalPrice: 45.99,
    discount: 20,
    images: ["/images/candles/candle-collection-8.jpg"],
    category: "Soy Wax",
    stockQuantity: 25,
    features: ["Modern design", "Subtle fragrance", "Contemporary style", "Clean burning"]
  },
  {
    name: "Rose Garden Romance",
    title: "Rose Garden Romance",
    description: "Romantic rose-scented candles that create an enchanting ambiance for special moments and intimate evenings.",
    price: 55.99,
    originalPrice: 69.99,
    discount: 20,
    images: ["/images/candles/candle-collection-9.jpg"],
    category: "Gift Sets",
    stockQuantity: 14,
    features: ["Rose garden scent", "Romantic ambiance", "Premium quality", "Gift-ready packaging"]
  },
  {
    name: "Premium Candle Gift Set",
    title: "Premium Candle Gift Set",
    description: "Curated collection of our finest candles in beautiful gift packaging. Perfect for special occasions and holidays.",
    price: 75.00,
    originalPrice: 95.00,
    discount: 21,
    images: ["/images/candles/candle-collection-10.jpg"],
    category: "Gift Sets",
    stockQuantity: 12,
    features: ["Curated selection", "Gift packaging", "Premium quality", "Special occasions"]
  },
  {
    name: "Seasonal Collection Box",
    title: "Seasonal Collection Box",
    description: "Seasonal candle collection featuring scents that capture the essence of each season. Perfect gift for candle lovers.",
    price: 68.00,
    originalPrice: 85.00,
    discount: 20,
    images: ["/images/candles/candle-collection-1.png"],
    category: "Gift Sets",
    stockQuantity: 16,
    features: ["Seasonal scents", "Complete collection", "Candle lover gift", "Seasonal essence"]
  },
  {
    name: "Decorative Tea Light Set",
    title: "Decorative Tea Light Set",
    description: "Colorful decorative tea lights with intricate patterns and metallic accents. Creates beautiful ambient lighting.",
    price: 34.99,
    originalPrice: 44.99,
    discount: 22,
    images: ["/images/candles/candle-collection-2.png"],
    category: "Decor Candles",
    stockQuantity: 25,
    features: ["Metallic patterns", "Colorful designs", "Tea light size", "Ambient lighting"]
  },
  {
    name: "Sculptural Pillar Candles",
    title: "Sculptural Pillar Candles",
    description: "Artistic pillar candles with unique shapes and textures. Perfect for modern home decor and special displays.",
    price: 42.99,
    originalPrice: 52.99,
    discount: 19,
    images: ["/images/candles/candle-collection-3.png"],
    category: "Decor Candles",
    stockQuantity: 20,
    features: ["Artistic design", "Unique shapes", "Modern decor", "Special displays"]
  },
  {
    name: "Geometric Floating Candles",
    title: "Geometric Floating Candles",
    description: "Modern geometric floating candles that create stunning water displays. Perfect for events and contemporary decor.",
    price: 29.99,
    originalPrice: 37.99,
    discount: 21,
    images: ["/images/candles/candle-collection-4.png"],
    category: "Decor Candles",
    stockQuantity: 30,
    features: ["Geometric design", "Floating candles", "Water displays", "Event perfect"]
  },
  {
    name: "Nature's Kiss Aromatherapy",
    title: "Nature's Kiss Aromatherapy",
    description: "Therapeutic candle in elegant black container. Infused with essential oils for relaxation and wellness.",
    price: 52.99,
    originalPrice: 65.99,
    discount: 20,
    images: ["/images/candles/candle-collection-5.png"],
    category: "Aromatherapy",
    stockQuantity: 18,
    features: ["Essential oils", "Therapeutic benefits", "Black glass container", "Wellness formula"]
  },
  {
    name: "Lavender Dreams Collection",
    title: "Lavender Dreams Collection",
    description: "Soothing lavender-scented candles perfect for relaxation and stress relief. Made with pure lavender essential oil.",
    price: 42.99,
    originalPrice: 52.99,
    discount: 19,
    images: ["/images/candles/candle-collection-6.jpg"],
    category: "Aromatherapy",
    stockQuantity: 22,
    features: ["Pure lavender oil", "Stress relief", "Long burn time", "Calming scent"]
  },
  {
    name: "Ocean Breeze Serenity",
    title: "Ocean Breeze Serenity",
    description: "Fresh ocean-inspired candles that bring the calming essence of the sea to your home. Perfect for meditation.",
    price: 46.99,
    originalPrice: 58.99,
    discount: 20,
    images: ["/images/candles/candle-collection-7.jpg"],
    category: "Aromatherapy",
    stockQuantity: 16,
    features: ["Ocean-fresh scent", "Calming effect", "Natural ingredients", "Meditation aid"]
  },
  {
    name: "Eucalyptus Zen Collection",
    title: "Eucalyptus Zen Collection",
    description: "Refreshing eucalyptus aromatherapy candles that promote mental clarity and respiratory wellness.",
    price: 49.99,
    originalPrice: 62.99,
    discount: 21,
    images: ["/images/candles/candle-collection-8.jpg"],
    category: "Aromatherapy",
    stockQuantity: 19,
    features: ["Eucalyptus oil", "Mental clarity", "Respiratory wellness", "Zen experience"]
  }
];

export const addSampleProducts = async (): Promise<void> => {
  try {
    console.log('Mock: Adding sample products...');

    // Since we're using mock Firebase, just log success
    for (const product of sampleProducts.slice(0, 5)) {
      await addDoc(collection(db, 'products'), {
        ...product,
        id: `sample_${Date.now()}_${Math.random()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Mock: Sample products added successfully!');
  } catch (error) {
    console.error('Error adding sample products:', error);
  }
};
