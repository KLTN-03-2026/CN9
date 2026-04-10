export const parseImageUrls = (value: any): string[] => {
  try {
    if (typeof value !== "string") return [];
    const trimmed = value.trim();
    if (!trimmed.startsWith("[")) return [];
    return JSON.parse(trimmed);
  } catch {
    return [];
  }
};
