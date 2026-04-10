interface ReviewBase {
  content: string;
  rating: number;
}

export interface ReviewType extends ReviewBase {
  id: number;
  images: string[];
}
