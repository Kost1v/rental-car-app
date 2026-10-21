import { Car } from '../models/car.model';

export const MOCK_CARS: Car[] = [
  {
    id: 'mock-1', brand: 'Toyota', model: 'Camry', year: 2022, rentalPrice: 40,
    address: 'Kyiv, Ukraine', rentalCompany: 'RentalCar', type: 'Sedan', mileage: 12500,
    img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80',
    fuelConsumption: '7.4 L/100km', engineSize: '2.5L', description: 'A comfortable and reliable sedan for city trips and longer journeys.',
    rentalConditions: ['Minimum age: 21', 'Valid driving licence', 'Security deposit required'],
    accessories: ['Air conditioning', 'Bluetooth', 'Cruise control'],
  },
  {
    id: 'mock-2', brand: 'Volkswagen', model: 'Tiguan', year: 2021, rentalPrice: 60,
    address: 'Lviv, Ukraine', rentalCompany: 'DriveNow', type: 'SUV', mileage: 28400,
    img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80',
    fuelConsumption: '8.1 L/100km', engineSize: '2.0L', description: 'A spacious SUV with confident handling and room for the whole family.',
    rentalConditions: ['Minimum age: 23', 'Valid driving licence', 'No smoking'],
    accessories: ['Navigation', 'Heated seats', 'Parking sensors'],
  },
  {
    id: 'mock-3', brand: 'BMW', model: '3 Series', year: 2023, rentalPrice: 80,
    address: 'Odesa, Ukraine', rentalCompany: 'Premium Cars', type: 'Sedan', mileage: 8200,
    img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
    fuelConsumption: '6.8 L/100km', engineSize: '2.0L', description: 'A premium sedan combining agile performance with everyday comfort.',
    rentalConditions: ['Minimum age: 25', 'Valid driving licence', 'Security deposit required'],
    accessories: ['Leather interior', 'Apple CarPlay', 'Rear camera'],
  },
  {
    id: 'mock-4', brand: 'Ford', model: 'Mustang', year: 2020, rentalPrice: 70,
    address: 'Kharkiv, Ukraine', rentalCompany: 'AutoRent', type: 'Coupe', mileage: 35600,
    img: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=900&q=80',
    fuelConsumption: '10.2 L/100km', engineSize: '5.0L', description: 'An iconic coupe for drivers who want every trip to feel special.',
    rentalConditions: ['Minimum age: 25', 'Valid driving licence', 'No track use'],
    accessories: ['Premium audio', 'Sport mode', 'Bluetooth'],
  },
  {
    id: 'mock-5', brand: 'Nissan', model: 'Leaf', year: 2022, rentalPrice: 30,
    address: 'Dnipro, Ukraine', rentalCompany: 'Green Drive', type: 'Electric', mileage: 9700,
    img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80',
    fuelConsumption: 'Electric', engineSize: '40 kWh', description: 'A quiet, efficient electric car that is easy to drive around town.',
    rentalConditions: ['Minimum age: 21', 'Valid driving licence', 'Return with charge above 30%'],
    accessories: ['Fast charging', 'Navigation', 'Heated seats'],
  },
  {
    id: 'mock-6', brand: 'Jeep', model: 'Wrangler', year: 2021, rentalPrice: 80,
    address: 'Bukovel, Ukraine', rentalCompany: 'Adventure Cars', type: 'SUV', mileage: 19800,
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
    fuelConsumption: '9.8 L/100km', engineSize: '2.0L', description: 'A capable adventure vehicle ready for mountain roads and weekend escapes.',
    rentalConditions: ['Minimum age: 23', 'Valid driving licence', 'Off-road roads permitted'],
    accessories: ['4x4 drive', 'Removable roof', 'Bluetooth'],
  },
];
