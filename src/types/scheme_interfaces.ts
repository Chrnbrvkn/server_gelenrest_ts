interface IUsers {
  id: number;
  email: string;
  password: string;
  name?: string | null;
  surname?: string | null;
}

interface IUserRoles {
  userId: number;
  roleId: number;
}

interface IRoles {
  id: number;
  value: number;
}

interface IHouses {
  id: number;
  name: string;
  address: string;
  description_1?: string | null;
  description_2?: string | null;
  description_3?: string | null;
  description_4?: string | null;
  roomCount: number;
  roomCategories?: string | null;
  meals?: string | null;
  bookingConditions?: string | null;
  checkoutTime?: string | null;
  timeToSea?: string | null;
  timeToMarket?: string | null;
  timeToCafe?: string | null;
  timeToBusStop?: string | null;
  timeToBusCityCenter?: string | null;
  internet?: boolean | null;
  allHouseBooking?: boolean | null;
  tv?: boolean | null;
  pool?: boolean | null;
  babyCot?: boolean | null;
  yard?: boolean | null;
  dishwasher?: boolean | null;
  washingMachine?: boolean | null;
  diningArea?: boolean | null;
  freeParking?: boolean | null;
  roomCleaning?: boolean | null;
  beddingChange?: boolean | null;
  sharedKitchen?: boolean | null;
  iron?: boolean | null;
  bbqGrill?: boolean | null;
  refrigerator?: boolean | null;
  transferService?: boolean | null;
  laundryService?: boolean | null;
}

interface IHousesPictures {
  id: number;
  url: string;
  houseId: number;
}

interface IRooms {
  id: number;
  name: string;
  address: string;
  price: number;
  roomCount: number;
  bedCount: number;
  bedroom?: string | null;
  bathroom: 'в номере' | 'на этаже';
  bathType: 'ванна' | 'душ';
  meal: 'в номере' | 'отдельно';
  facilities?: string | null;
  robotCleaner?: boolean | null;
  yandexColumn?: boolean | null;
  level: number;
  houseId: number;
}

interface IRoomsPictures {
  id: number;
  url: string;
  roomId: number;
}

interface IAparts {
  id: number;
  name: string;
  address: string;
  price: number;
  description_1?: string | null;
  description_2?: string | null;
  description_3?: string | null;
  description_4?: string | null;
  bedCount: number;
  roomCount: number;
  roomCategories?: string | null;
  level: number;
  meal: 'в номере' | 'отдельно';
  bathroom: 'в номере' | 'на этаже';
  bathType: 'ванна' | 'душ';
  bookingConditions?: string | null;
  checkoutTime?: string | null;
  timeToSea?: string | null;
  timeToMarket?: string | null;
  timeToCafe?: string | null;
  timeToBusStop?: string | null;
  timeToBusCityCenter?: string | null;
  internet?: boolean | null;
  robotCleaner?: boolean | null;
  yandexColumn?: boolean | null;
  tv?: boolean | null;
  pool?: boolean | null;
  babyCot?: boolean | null;
  yard?: boolean | null;
  dishwasher?: boolean | null;
  washingMachine?: boolean | null;
  diningArea?: boolean | null;
  freeParking?: boolean | null;
  roomCleaning?: boolean | null;
  beddingChange?: boolean | null;
  sharedKitchen?: boolean | null;
  iron?: boolean | null;
  bbqGrill?: boolean | null;
  refrigerator?: boolean | null;
  transferService?: boolean | null;
  laundryService?: boolean | null;
}

interface IApartsPictures {
  id: number;
  url: string;
  apartId: number;
}

interface IBookings {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  status: 'В ожидании' | 'Отменён' | 'Подтвеждён';
  guestName?: string | null;
  guestContact: string;
  guestsCount: number;
  roomId?: number | null;
  apartId?: number | null;
  address: string;
  houseId?: number | null;
  dailyRate: number;
  totalCost: number;
  totaldays: number;
  childAge?: number | null;
  petBreed?: string | null;
  petWeight?: number | null;
  smoker?: boolean | null;
  disabledAccess?: boolean | null;
  economyAccomodation?: boolean | null;
  maxServiceAccomodation?: boolean | null;
  breakfastIncluded?: boolean | null;
  toursIncluded?: boolean | null;
  workInternet?: boolean | null;
  transfer?: boolean | null;
  discounts?: string | null;
  bonuses?: string | null;
}
export type {
  IUsers,
  IRoles,
  IUserRoles,
  IHouses,
  IAparts,
  IRooms,
  IBookings,
  IHousesPictures,
  IApartsPictures,
  IRoomsPictures,
};
