export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  rentalPrice: number;
  address: string;
  rentalCompany: string;
  type: string;
  mileage: number;
  img: string;
  fuelConsumption: string;
  engineSize: string;
  description: string;
  rentalConditions: string[];
  accessories: string[];
}

export interface CarsResponse {
  cars: Car[];
  page: number;
  totalPages: number;
  totalCars: number;
}

export interface CarFilters {
  brand: string;
  rentalPrice: number | null;
  minMileage: number | null;
  maxMileage: number | null;
}
