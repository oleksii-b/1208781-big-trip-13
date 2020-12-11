export const sortPriceDown = (pointA, pointB) => pointB.price - pointA.price;
export const sortTimeDown = (pointA, pointB) => {
  return (pointB.date.finish - pointB.date.start) - (pointA.date.finish - pointA.date.start);
};
