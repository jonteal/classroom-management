export const Car = ({ make, model, year, price }) => (
  <li>
    <p>Make: {make}</p>
    <p>Model: {model}</p>
    <p>Year: {year}</p>
    <p>Price: ${price}</p>
  </li>
);
