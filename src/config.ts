import type { Product } from './types';

export const CSV_HEADERS = ['id', 'name', 'price', 'category', 'unit', 'image_filename'] as const;

export const MOCK_DATA: Product[] = [
  { id: '1', name: 'Fresh Cow Meat (1kg)', price: 4500, category: 'Livestock', unit: 'per kg', image_filename: 'https://images.unsplash.com/photo-1588152928686-39e246e7f225?auto=format&fit=crop&w=500&q=80' },
  { id: '2', name: 'Whole Fresh Chicken', price: 6000, category: 'Livestock', unit: 'per bird', image_filename: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=500&q=80' },
  { id: '3', name: 'Goat Meat (1kg)', price: 5500, category: 'Livestock', unit: 'per kg', image_filename: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80' },
  { id: '4', name: 'Premium Rice (50kg Bag)', price: 75000, category: 'Grains', unit: '50kg bag', image_filename: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80' },
  { id: '5', name: 'Clean White Maize (1 Mudu)', price: 1200, category: 'Grains', unit: '1 mudu', image_filename: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=500&q=80' },
  { id: '6', name: 'Processed White Garri (1 Mudu)', price: 1500, category: 'Grains', unit: '1 mudu', image_filename: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=500&q=80' },
  { id: '7', name: 'Fresh Bell Peppers (Basket)', price: 3000, category: 'Vegetables', unit: 'basket', image_filename: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=500&q=80' },
  { id: '8', name: 'Ripe Farm Tomatoes (Basket)', price: 4500, category: 'Vegetables', unit: 'basket', image_filename: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80' },
  { id: '9', name: 'Hot Scotch Bonnet Pepper', price: 2000, category: 'Vegetables', unit: 'small basket', image_filename: 'https://images.unsplash.com/photo-1583225214464-9296029427aa?auto=format&fit=crop&w=500&q=80' },
  { id: '10', name: 'Abuja Sweet Yam (1 Large Tuber)', price: 3500, category: 'Tubers', unit: '1 tuber', image_filename: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=500&q=80' },
  { id: '11', name: 'Fresh Crate of Poultry Eggs', price: 4200, category: 'Poultry', unit: '30 eggs crate', image_filename: 'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?auto=format&fit=crop&w=500&q=80' },
];
