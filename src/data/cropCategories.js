// Crop categories with detailed varieties
export const cropCategories = [
  // Cereals
  {
    id: 'cereals',
    name: 'Cereals',
    subcategories: [
      {
        name: 'Rice Varieties',
        items: ['Sona Masoori', 'Basmati 370', 'Ponni', 'Swarna', 'IR64', 'Jaya', 'BPT 5204'],
        page: 1,
        totalPages: 2
      },
      {
        name: 'Wheat',
        items: ['Sharbati', 'Durum', 'Khapli', 'Lokwan', 'MP Wheat', 'Sujata', 'HI 1500'],
        page: 1,
        totalPages: 2
      },
      {
        name: 'Millets',
        items: ['Ragi (Finger Millet)', 'Jowar (Sorghum)', 'Bajra (Pearl Millet)', 'Foxtail Millet', 'Little Millet', 'Kodo Millet', 'Barnyard Millet'],
        page: 1,
        totalPages: 1
      },
      {
        name: 'Maize',
        items: ['Sweet Corn', 'Baby Corn', 'Popcorn', 'Flint Corn', 'Dent Corn', 'Waxy Corn', 'Pod Corn'],
        page: 1,
        totalPages: 1
      },
      {
        name: 'Barley',
        items: ['Hulless Barley', 'Hulled Barley', 'Pearl Barley', 'Barley Flakes', 'Barley Flour'],
        page: 1,
        totalPages: 1
      }
    ]
  },
  // Pulses
  {
    id: 'pulses',
    name: 'Pulses',
    subcategories: [
      {
        name: 'Toor Dal (Pigeon Pea)',
        items: ['Maruti', 'Asha', 'Pusa 991', 'Prabhat', 'Vaishali', 'UPAS 120'],
        page: 1,
        totalPages: 1
      },
      {
        name: 'Chana (Chickpeas)',
        items: ['Desi Chana', 'Kabuli Chana', 'Green Chana', 'Kala Chana', 'Kabuli 100'],
        page: 1,
        totalPages: 1
      },
      {
        name: 'Moong Dal (Green Gram)',
        items: ['Pusa Vishal', 'Pusa 9531', 'SML 668', 'Pusa 0672', 'PDM 54'],
        page: 1,
        totalPages: 1
      },
      {
        name: 'Urad Dal (Black Gram)',
        items: ['T9', 'Pant U 30', 'TPU 4', 'AKU 9904', 'Tau 1'],
        page: 1,
        totalPages: 1
      },
      {
        name: 'Masoor Dal (Red Lentils)',
        items: ['Pusa Vaibhav', 'HUL 57', 'KLS 218', 'JL 3', 'Pusa 4076'],
        page: 1,
        totalPages: 1
      }
    ]
  },
  // Other Categories with similar structure
  {
    id: 'oilseeds',
    name: 'Oilseeds',
    subcategories: [
      {
        name: 'Groundnut',
        items: ['TMV 2', 'Kadiri 6', 'TG 37B', 'Girnar 1', 'TAG 24'],
        page: 1,
        totalPages: 1
      },
      {
        name: 'Soybean',
        items: ['JS 335', 'JS 9560', 'MAUS 71', 'NRC 37', 'JS 20 34'],
        page: 1,
        totalPages: 1
      }
    ]
  },
  {
    id: 'cash-crops',
    name: 'Cash Crops',
    subcategories: [
      {
        name: 'Cotton',
        items: ['BT Cotton', 'Desi Cotton', 'Hybrid Cotton', 'Organic Cotton'],
        page: 1,
        totalPages: 1
      },
      {
        name: 'Sugarcane',
        items: ['Co 0238', 'Co 86032', 'Co 99004', 'Co 419', 'Co 62175'],
        page: 1,
        totalPages: 1
      }
    ]
  },
  {
    id: 'spices',
    name: 'Spices',
    subcategories: [
      {
        name: 'Chilies',
        items: ['Byadgi', 'Kashmiri', 'Guntur', 'Jwala', 'Bhut Jolokia'],
        page: 1,
        totalPages: 1
      },
      {
        name: 'Pepper',
        items: ['Black Pepper', 'White Pepper', 'Green Pepper', 'Red Pepper'],
        page: 1,
        totalPages: 1
      }
    ]
  }
];

// Export a flattened list of all categories for navigation
export const allCategories = cropCategories.flatMap(category => [
  category.name,
  ...category.subcategories
]);
