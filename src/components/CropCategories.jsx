// Crop categories data
export const cropCategories = [
  // Cereals
  {
    id: 'cereals',
    name: 'Cereals',
    subcategories: [
      'Rice Varieties', 'Millets', 'Wheat', 'Maize', 'Sorghum', 'Barley', 'Oats'
    ]
  },
  // Pulses
  {
    id: 'pulses',
    name: 'Pulses',
    subcategories: [
      'Toor Dal', 'Chana', 'Moong Dal', 'Urad Dal', 'Masoor Dal', 'Rajma', 'Cowpea'
    ]
  },
  // Vegetables
  {
    id: 'vegetables',
    name: 'Vegetables',
    subcategories: [
      'Leafy Greens', 'Root Vegetables', 'Tubers', 'Gourds', 'Beans', 'Tomatoes', 'Brinjals'
    ]
  },
  // Fruits
  {
    id: 'fruits',
    name: 'Fruits',
    subcategories: [
      'Tropical Fruits', 'Citrus', 'Berries', 'Melons', 'Stone Fruits', 'Exotic Fruits'
    ]
  },
  // Spices
  {
    id: 'spices',
    name: 'Spices',
    subcategories: [
      'Chilies', 'Pepper', 'Cardamom', 'Cumin', 'Coriander', 'Turmeric', 'Ginger', 'Garlic'
    ]
  },
  // Nuts & Seeds
  {
    id: 'nuts-seeds',
    name: 'Nuts & Seeds',
    subcategories: [
      'Groundnuts', 'Cashews', 'Almonds', 'Sesame', 'Sunflower', 'Pumpkin Seeds', 'Flax Seeds'
    ]
  },
  // Plantation Crops
  {
    id: 'plantation',
    name: 'Plantation Crops',
    subcategories: [
      'Tea', 'Coffee', 'Rubber', 'Coconut', 'Arecanut', 'Cocoa', 'Cashew'
    ]
  },
  // Flowers
  {
    id: 'flowers',
    name: 'Flowers',
    subcategories: [
      'Jasmine', 'Marigold', 'Rose', 'Chrysanthemum', 'Tuberose', 'Orchids'
    ]
  },
  // Medicinal Plants
  {
    id: 'medicinal',
    name: 'Medicinal Plants',
    subcategories: [
      'Tulsi', 'Aloe Vera', 'Ashwagandha', 'Shatavari', 'Brahmi', 'Stevia'
    ]
  },
  // Cash Crops
  {
    id: 'cash-crops',
    name: 'Cash Crops',
    subcategories: [
      'Sugarcane', 'Cotton', 'Jute', 'Tobacco', 'Oilseeds', 'Tamarind'
    ]
  }
];

// Export a flattened list of all categories for navigation
export const allCategories = cropCategories.flatMap(category => [
  category.name,
  ...category.subcategories
]);
