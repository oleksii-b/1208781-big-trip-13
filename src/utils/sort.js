export const sortPriceDown = (prevPoint, nextPoint) => nextPoint.price - prevPoint.price;
export const sortTimeDown = (prevPoint, nextPoint) => {
  return (nextPoint.date.finish - nextPoint.date.start) - (prevPoint.date.finish - prevPoint.date.start);
};
export const sortDefault = (prevPoint, nextPoint) => {
  if (prevPoint.date.start.isAfter(nextPoint.date.start)) {
    return 1;
  }
  return -1;
};
