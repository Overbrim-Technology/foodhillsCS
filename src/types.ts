export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  unit: string;
  image_filename: string;
  last_order_date?: string;
};

export type CartItem = Product & {
  quantity: number;
};
