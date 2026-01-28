import { useEffect, useState } from "react";
import { Car } from "./components/Car";

const App = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("api/v1/cars")
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((error) => console.error("Error fetching cars:", error));
  }, []);

  console.log("Cars data:", cars);
  return (
    <div>
      <h1>Welcome to the Car Store</h1>
      {cars.map((car) => (
        <Car key={car.id} {...car} />
      ))}
    </div>
  );
};

export default App;
