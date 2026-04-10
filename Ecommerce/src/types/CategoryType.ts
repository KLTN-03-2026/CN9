interface CategoryBase {
  name: string;
  genderId: number | null;
  description: string;
  imageCategory?: File | null;
}

export interface CreateCategory extends CategoryBase {}

export interface UpdateCategory extends Partial<CategoryBase> {}

export interface CategoryType extends CategoryBase {
  id: number;
}
