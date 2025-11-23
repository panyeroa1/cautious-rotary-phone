
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Booking {
  pnr: string;
  passengerName: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  date: string;
  status: 'Confirmed' | 'Waitlist' | 'Cancelled' | 'Checked-in';
  class: 'Economy' | 'Business';
  seat?: string;
}

export const MOCK_BOOKINGS: Booking[] = [
  { pnr: 'THY882', passengerName: 'Ahmet Yılmaz', flightNumber: 'TK1982', departureCity: 'London (LHR)', arrivalCity: 'Istanbul (IST)', date: '2024-05-20', status: 'Confirmed', class: 'Economy', seat: '12A' },
  { pnr: 'THY101', passengerName: 'Elif Demir', flightNumber: 'TK001', departureCity: 'Istanbul (IST)', arrivalCity: 'New York (JFK)', date: '2024-05-21', status: 'Checked-in', class: 'Business', seat: '2A' },
  { pnr: 'THY345', passengerName: 'John Smith', flightNumber: 'TK1985', departureCity: 'London (LHR)', arrivalCity: 'Istanbul (IST)', date: '2024-05-22', status: 'Confirmed', class: 'Economy', seat: '15C' },
  { pnr: 'THY990', passengerName: 'Ayşe Kaya', flightNumber: 'TK1821', departureCity: 'Istanbul (IST)', arrivalCity: 'Paris (CDG)', date: '2024-05-23', status: 'Waitlist', class: 'Economy' },
  { pnr: 'THY777', passengerName: 'Michael Brown', flightNumber: 'TK077', departureCity: 'Istanbul (IST)', arrivalCity: 'Miami (MIA)', date: '2024-05-24', status: 'Cancelled', class: 'Business' },
  { pnr: 'THY555', passengerName: 'Fatma Çelik', flightNumber: 'TK2408', departureCity: 'Istanbul (IST)', arrivalCity: 'Antalya (AYT)', date: '2024-05-20', status: 'Confirmed', class: 'Economy', seat: '5F' },
  { pnr: 'THY123', passengerName: 'Mehmet Öztürk', flightNumber: 'TK1982', departureCity: 'London (LHR)', arrivalCity: 'Istanbul (IST)', date: '2024-05-20', status: 'Confirmed', class: 'Business', seat: '1C' },
  { pnr: 'THY456', passengerName: 'Sarah Johnson', flightNumber: 'TK003', departureCity: 'Istanbul (IST)', arrivalCity: 'New York (JFK)', date: '2024-05-21', status: 'Confirmed', class: 'Economy', seat: '22D' },
  { pnr: 'THY789', passengerName: 'Caner Erkin', flightNumber: 'TK1857', departureCity: 'Istanbul (IST)', arrivalCity: 'Madrid (MAD)', date: '2024-05-25', status: 'Checked-in', class: 'Business', seat: '3F' },
  { pnr: 'THY222', passengerName: 'Zeynep Arslan', flightNumber: 'TK2004', departureCity: 'Istanbul (IST)', arrivalCity: 'Nevşehir (NAV)', date: '2024-05-22', status: 'Confirmed', class: 'Economy', seat: '18A' },
  { pnr: 'THY333', passengerName: 'Hans Müller', flightNumber: 'TK1587', departureCity: 'Frankfurt (FRA)', arrivalCity: 'Istanbul (IST)', date: '2024-05-20', status: 'Confirmed', class: 'Business', seat: '4D' },
  { pnr: 'THY444', passengerName: 'Elena Petrova', flightNumber: 'TK0417', departureCity: 'Istanbul (IST)', arrivalCity: 'Moscow (VKO)', date: '2024-05-26', status: 'Confirmed', class: 'Economy', seat: '10B' },
  { pnr: 'THY666', passengerName: 'Burak Yılmaz', flightNumber: 'TK1955', departureCity: 'Amsterdam (AMS)', arrivalCity: 'Istanbul (IST)', date: '2024-05-21', status: 'Waitlist', class: 'Economy' },
  { pnr: 'THY001', passengerName: 'Selin Şahin', flightNumber: 'TK2154', departureCity: 'Istanbul (IST)', arrivalCity: 'Ankara (ESB)', date: '2024-05-20', status: 'Checked-in', class: 'Economy', seat: '7C' },
  { pnr: 'THY002', passengerName: 'David Wilson', flightNumber: 'TK001', departureCity: 'Istanbul (IST)', arrivalCity: 'New York (JFK)', date: '2024-05-21', status: 'Confirmed', class: 'Economy', seat: '45H' },
  { pnr: 'THY003', passengerName: 'Emine Koç', flightNumber: 'TK1761', departureCity: 'Istanbul (IST)', arrivalCity: 'Helsinki (HEL)', date: '2024-05-24', status: 'Confirmed', class: 'Business', seat: '2D' },
  { pnr: 'THY004', passengerName: 'Ali Vural', flightNumber: 'TK009', departureCity: 'Istanbul (IST)', arrivalCity: 'Los Angeles (LAX)', date: '2024-05-27', status: 'Confirmed', class: 'Economy', seat: '33K' },
  { pnr: 'THY005', passengerName: 'Jessica Lee', flightNumber: 'TK090', departureCity: 'Seoul (ICN)', arrivalCity: 'Istanbul (IST)', date: '2024-05-22', status: 'Checked-in', class: 'Business', seat: '5A' },
  { pnr: 'THY006', passengerName: 'Mustafa Aksoy', flightNumber: 'TK1321', departureCity: 'Istanbul (IST)', arrivalCity: 'Bologna (BLQ)', date: '2024-05-23', status: 'Confirmed', class: 'Economy', seat: '14D' },
  { pnr: 'THY007', passengerName: 'Ceren Yıldız', flightNumber: 'TK1986', departureCity: 'London (LHR)', arrivalCity: 'Istanbul (IST)', date: '2024-05-22', status: 'Confirmed', class: 'Economy', seat: '21J' },
  { pnr: 'THY008', passengerName: 'Robert Taylor', flightNumber: 'TK017', departureCity: 'Istanbul (IST)', arrivalCity: 'Toronto (YYZ)', date: '2024-05-28', status: 'Confirmed', class: 'Business', seat: '8K' },
  { pnr: 'THY009', passengerName: 'Leyla Aydın', flightNumber: 'TK2312', departureCity: 'Izmir (ADB)', arrivalCity: 'Istanbul (IST)', date: '2024-05-20', status: 'Checked-in', class: 'Economy', seat: '6A' },
  { pnr: 'THY010', passengerName: 'Omar Hassan', flightNumber: 'TK0762', departureCity: 'Istanbul (IST)', arrivalCity: 'Dubai (DXB)', date: '2024-05-25', status: 'Confirmed', class: 'Economy', seat: '19C' },
  { pnr: 'THY011', passengerName: 'Sophie Martin', flightNumber: 'TK1822', departureCity: 'Paris (CDG)', arrivalCity: 'Istanbul (IST)', date: '2024-05-23', status: 'Waitlist', class: 'Economy' },
  { pnr: 'THY012', passengerName: 'Kemal Sunal', flightNumber: 'TK1982', departureCity: 'London (LHR)', arrivalCity: 'Istanbul (IST)', date: '2024-05-20', status: 'Confirmed', class: 'Business', seat: '1A' }
];

export interface Flight {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}

export const MOCK_FLIGHTS: Flight[] = [
  { flightNumber: 'TK1982', origin: 'London (LHR)', destination: 'Istanbul (IST)', departureTime: '14:00', arrivalTime: '20:00', price: 250 },
  { flightNumber: 'TK001', origin: 'Istanbul (IST)', destination: 'New York (JFK)', departureTime: '08:00', arrivalTime: '12:00', price: 800 },
  { flightNumber: 'TK1985', origin: 'London (LHR)', destination: 'Istanbul (IST)', departureTime: '10:00', arrivalTime: '16:00', price: 280 },
  { flightNumber: 'TK1857', origin: 'Istanbul (IST)', destination: 'Madrid (MAD)', departureTime: '13:00', arrivalTime: '16:30', price: 300 },
  { flightNumber: 'TK077', origin: 'Istanbul (IST)', destination: 'Miami (MIA)', departureTime: '15:00', arrivalTime: '20:00', price: 950 },
  { flightNumber: 'TK003', origin: 'Istanbul (IST)', destination: 'New York (JFK)', departureTime: '14:00', arrivalTime: '18:00', price: 850 },
];

// Helpers
export function getBooking(pnr: string): Booking | undefined {
  return MOCK_BOOKINGS.find(b => b.pnr.toUpperCase() === pnr.toUpperCase());
}

export function findBookingByName(name: string): Booking[] {
  return MOCK_BOOKINGS.filter(b => b.passengerName.toLowerCase().includes(name.toLowerCase()));
}

export function updateBookingDate(pnr: string, newDate: string): Booking | null {
  const booking = getBooking(pnr);
  if (booking) {
    booking.date = newDate;
    booking.status = 'Confirmed'; // Assume rebooking confirms it
    return booking;
  }
  return null;
}

export function searchFlights(origin: string | undefined, destination: string | undefined): Flight[] {
  return MOCK_FLIGHTS.filter(f =>
    (!origin || f.origin.toLowerCase().includes(origin.toLowerCase())) &&
    (!destination || f.destination.toLowerCase().includes(destination.toLowerCase()))
  );
}

export function createBooking(passengerName: string, flightNumber: string, date: string): Booking {
  const pnr = 'THY' + Math.floor(Math.random() * 9000 + 1000);
  const flight = MOCK_FLIGHTS.find(f => f.flightNumber === flightNumber) || MOCK_FLIGHTS[0];
  
  const booking: Booking = {
    pnr,
    passengerName,
    flightNumber,
    departureCity: flight.origin,
    arrivalCity: flight.destination,
    date,
    status: 'Confirmed',
    class: 'Economy',
    seat: 'Pending'
  };
  MOCK_BOOKINGS.push(booking);
  return booking;
}
