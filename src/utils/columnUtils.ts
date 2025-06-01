export const highlightSearchTerm = (text: string, searchTerm?: string) => {
  if (!searchTerm) return false;
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

export const validateTitle = (title: string): boolean => {
  return title.trim().length > 0;
};