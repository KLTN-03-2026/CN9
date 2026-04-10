interface ProductBase {
  name: string;
  price: number;
  sale: { discount_type: "percent" | "fixed"; discount_value: number };
  colors: {
    id: number;
    hex: string;
    name_color: string;
  }[];
  sizes: {
    id: number;
    Symbol: string;
  }[];
  variants: [
    {
      id: number;
      image_url: string;
      color: { id: number; hex: string; name_color: string };
      size: { id: number; Symbol: string };
      stock: number;
    },
  ];
}

export interface ProductType extends ProductBase {
  id: number;
  image_url: string;
  createdAt: string;
  category: { name: string };
  slug: string;
  variantMap: {
    colorImageMap: Record<number, string>;
    colorToSizes: Record<number, number[]>;
    sizeToColors: Record<number, number[]>;
  };
}

export interface DetailProductType extends ProductBase {
  id: number;
  description: string;
  image_url: string[];
  reviews: {
    content: string;
    rating: number;
    username: string;
    avatar: string;
  }[];
  ratingSummary: {
    average: number;
    stars: Record<number, number>;
    total: number;
  };
}

export interface ProductItem {
  variantId: number;
  productId: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  isChecked: boolean;
  sale?: {
    discount_type: "fixed" | "percent";
    discount_value: number;
  } | null;
}

export interface ProductSearch {
  id: number;
  name: string;
  image_url: string[];
  price: string;
  slug: string;
  categoryName: string;
}
