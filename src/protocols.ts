import { Payment, Ticket } from '@prisma/client';

export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  error?: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export type CardPaymentParams = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

export type PaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

export type InputTicketBody = {
  ticketTypeId: number;
};

export type HotelsInput = {
  id: number;
  name: string;
  image: string;
  totalAvailableRooms: number;
  Rooms: RoomInput[];
};

type RoomInput = {
  id: number;
  name: string;
  capacity: number;
  hotelId: number;
  bookings: number;
  avaliable: number;
};

export type BookingInput = {
  id: number;
  room: Omit<RoomInput, 'bookings' | 'hotelId' | 'avaliable' | 'id'>;
  hotel: Omit<HotelsInput, 'Rooms' | 'totalAvailableRooms' | 'id'>;
  personCount: number;
};

export type HotelsInfos = {
  hotels: HotelsInput[];
  booking: BookingInput;
};

export type ActivitiesInput = {
  id: number;
  name: string;
  startsAt: string;
  endsAt: string;
  avaliable: number;
  capacity: number;
};

export type LocationsActivitiesInput = {
  id: number;
  name: string;
  Activities: ActivitiesInput[];
};

export type ActivitiesDates = {
  startsAt: Date;
};
