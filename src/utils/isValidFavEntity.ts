export const validFavEntities = ['track', 'album', 'artist'];

export const isValidFavEntity = (entity: string): boolean => {
  return validFavEntities.includes(entity);
};
