export type ReservationStatus =
  | "received"
  | "confirmed"
  | "arrived"
  | "completed"
  | "cancelled"
  | "rejected"
  | "on_hold";

export type BusinessHours = {
  open: string;
  close: string;
  slotMinutes: number;
};

export type Resource = {
  id: string;
  name: string;
  capacity: number;
};

export type Customer = {
  name: string;
  contact: string;
};

export type SlotView = {
  date: string;
  startTime: string;
  resourceId: string;
  capacity: number;
  occupied: number;
  remaining: number;
};

export type Reservation = {
  id: string;
  date: string;
  startTime: string;
  partySize: number;
  resourceId: string;
  customer: Customer;
  status: ReservationStatus;
};

export type AvailabilityResult =
  | { available: true; remaining: number }
  | { available: false; reason: "CLOSED" | "NO_SLOT" | "CAPACITY" | "UNKNOWN_RESOURCE" };

export type ApplyError =
  | "CLOSED"
  | "NO_SLOT"
  | "CAPACITY"
  | "UNKNOWN_RESOURCE"
  | "CUSTOMER_REQUIRED";

export type ShopDecision = "confirm" | "reject" | "hold";

export type TransitionTarget = "arrived" | "completed" | "cancelled";
