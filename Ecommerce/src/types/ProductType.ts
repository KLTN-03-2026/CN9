interface ProductBase {
  name: string;
  description: string;
  price: number;
}

export interface CreateProduct extends ProductBase {
  categoryId: number;
  saleId?: number;
  season: string;
}

export interface ProductType extends ProductBase {
  id: number;
  image_url: string;
  category: { id: number; name: string };
  status: { id: number; name: string; hex: string };
  sumStock: number;
  sale: { discount_type: "percent" | "fixed"; discount_value: number };
}

export interface UpdateProduct extends Partial<ProductBase> {
  categoryId?: number;
  saleId?: number;
  season: string;
}

interface ProductVariantBase {
  stock: number;
}

export interface CreateProductVariant extends ProductVariantBase {
  colorId: number;
  sizeId: number;
}

export interface ProductVariantType extends ProductVariantBase {
  id: number;
  image_url: string;
  name_color: string;
  hex_color: string;
  symbol_size: string;
}
