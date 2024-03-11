export const isValidFavEntity = (entity: string): boolean => {
  const validEntities = ['track', 'album', 'artist'];
  return validEntities.includes(entity);
};
