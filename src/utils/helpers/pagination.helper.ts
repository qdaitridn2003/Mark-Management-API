export const paginationHelper = (limit: number = 10, page: number = 1) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};
