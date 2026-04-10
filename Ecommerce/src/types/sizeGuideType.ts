export type SizeGuideRowType = {
  id: number;
  measurementType: string;
  [size: string]: string | number | undefined;
};

export type SizeGuideResponseType = {
  sizes: string[];
  data: SizeGuideRowType[];
};
