/** 曜日（0=日 … 6=土） */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ServiceMenu = {
  id: string;
  name: string;
  durationMinutes: number;
};

export type BreakBlock = {
  startMinutes: number;
  endMinutes: number;
};

export type BusinessHours = {
  openStartMinutes: number;
  openEndMinutes: number;
};

export type ReservationStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled";

export type Reservation = {
  id: string;
  menuId: string;
  menuName: string;
  durationMinutes: number;
  date: string;
  startMinutes: number;
  customerName: string;
  customerContact: string;
  status: ReservationStatus;
};

export type AvailableSlot = {
  date: string;
  startMinutes: number;
  endMinutes: number;
  menuId: string;
};

export type SalonState = {
  shopName: string;
  cancelPolicyText: string;
  businessHours: BusinessHours;
  closedWeekdays: Weekday[];
  breakBlocks: BreakBlock[];
  menus: ServiceMenu[];
  reservations: Reservation[];
};

export type ApplyReservationInput = {
  menuId: string;
  date: string;
  startMinutes: number;
  customerName: string;
  customerContact: string;
};
