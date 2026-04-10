interface CategoryBase {
  name: string;
  imageCategory: string;
}

export interface CategoryType extends CategoryBase {
  id: number;
  slug: string;
}
