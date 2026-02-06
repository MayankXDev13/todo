export const getPagination = (page?: number, limit?: number) => {
  const currentPage = page && page > 0 ? page : 1;
  const perPage = limit && limit > 0 ? limit : 10;

  const offset = (currentPage - 1) * perPage;

  return {
    currentPage,
    perPage,
    offset,
  };
};
