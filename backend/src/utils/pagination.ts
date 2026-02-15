export const getPagination = (page?: number, limit?: number) => {
  const currentPage = Math.max(1, page ?? 1);
  const perPage = Math.max(1, limit ?? 10);
  const offset = (currentPage - 1) * perPage;

  return {
    currentPage,
    perPage,
    offset,
  };
};