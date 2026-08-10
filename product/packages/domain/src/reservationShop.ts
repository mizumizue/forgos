import type {
  ApplyError,
  AvailabilityResult,
  BusinessHours,
  Customer,
  Reservation,
  ReservationStatus,
  Resource,
  ShopDecision,
  SlotView,
  TransitionTarget,
} from "./types.js";

export type CreateShopInput = {
  businessHours: BusinessHours;
  closedDates: string[];
  resources: Resource[];
};

export type ApplyInput = {
  date: string;
  startTime: string;
  partySize: number;
  resourceId: string;
  customer: Customer;
};

export type ReservationShop = {
  getBusinessHours(): BusinessHours;
  getClosedDates(): string[];
  setBusinessHours(hours: BusinessHours): void;
  setClosedDates(dates: string[]): void;
  listResources(): Resource[];
  listSlots(input: { date: string; resourceId: string }): SlotView[];
  checkAvailability(input: {
    date: string;
    startTime: string;
    partySize: number;
    resourceId: string;
  }): AvailabilityResult;
  applyReservation(
    input: ApplyInput,
  ): { ok: true; reservation: Reservation } | { ok: false; error: ApplyError };
  shopDecide(input: {
    reservationId: string;
    decision: ShopDecision;
  }): { ok: true; reservation: Reservation } | { ok: false; error: "NOT_FOUND" | "INVALID_STATE" };
  transitionStatus(input: {
    reservationId: string;
    to: TransitionTarget;
  }): { ok: true; reservation: Reservation } | { ok: false; error: "NOT_FOUND" | "INVALID_STATE" };
  listReservations(): Reservation[];
  getReservation(id: string): Reservation | undefined;
};

const OCCUPYING: ReadonlySet<ReservationStatus> = new Set([
  "received",
  "confirmed",
  "arrived",
  "on_hold",
]);

function parseHm(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function formatHm(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function slotStarts(hours: BusinessHours): string[] {
  const open = parseHm(hours.open);
  const close = parseHm(hours.close);
  const starts: string[] = [];
  for (let t = open; t + hours.slotMinutes <= close; t += hours.slotMinutes) {
    starts.push(formatHm(t));
  }
  return starts;
}

export function createReservationShop(seed: CreateShopInput): ReservationShop {
  let businessHours = { ...seed.businessHours };
  let closedDates = [...seed.closedDates];
  const resources = seed.resources.map((r) => ({ ...r }));
  const reservations: Reservation[] = [];

  function resourceById(id: string): Resource | undefined {
    return resources.find((r) => r.id === id);
  }

  function isClosed(date: string): boolean {
    return closedDates.includes(date);
  }

  function occupiedFor(date: string, startTime: string, resourceId: string): number {
    return reservations
      .filter(
        (r) =>
          r.date === date &&
          r.startTime === startTime &&
          r.resourceId === resourceId &&
          OCCUPYING.has(r.status),
      )
      .reduce((sum, r) => sum + r.partySize, 0);
  }

  function listSlots(input: { date: string; resourceId: string }): SlotView[] {
    const resource = resourceById(input.resourceId);
    if (!resource || isClosed(input.date)) {
      return [];
    }
    return slotStarts(businessHours).map((startTime) => {
      const occupied = occupiedFor(input.date, startTime, input.resourceId);
      return {
        date: input.date,
        startTime,
        resourceId: input.resourceId,
        capacity: resource.capacity,
        occupied,
        remaining: resource.capacity - occupied,
      };
    });
  }

  function checkAvailability(input: {
    date: string;
    startTime: string;
    partySize: number;
    resourceId: string;
  }): AvailabilityResult {
    const resource = resourceById(input.resourceId);
    if (!resource) {
      return { available: false, reason: "UNKNOWN_RESOURCE" };
    }
    if (isClosed(input.date)) {
      return { available: false, reason: "CLOSED" };
    }
    const slot = listSlots({ date: input.date, resourceId: input.resourceId }).find(
      (s) => s.startTime === input.startTime,
    );
    if (!slot) {
      return { available: false, reason: "NO_SLOT" };
    }
    if (input.partySize > slot.remaining) {
      return { available: false, reason: "CAPACITY" };
    }
    return { available: true, remaining: slot.remaining };
  }

  return {
    getBusinessHours() {
      return { ...businessHours };
    },
    getClosedDates() {
      return [...closedDates];
    },
    setBusinessHours(hours) {
      businessHours = { ...hours };
    },
    setClosedDates(dates) {
      closedDates = [...dates];
    },
    listResources() {
      return resources.map((r) => ({ ...r }));
    },
    listSlots,
    checkAvailability,
    applyReservation(input) {
      const name = input.customer.name.trim();
      const contact = input.customer.contact.trim();
      if (!name || !contact) {
        return { ok: false, error: "CUSTOMER_REQUIRED" };
      }
      const availability = checkAvailability(input);
      if (!availability.available) {
        return { ok: false, error: availability.reason };
      }
      const reservation: Reservation = {
        id: crypto.randomUUID(),
        date: input.date,
        startTime: input.startTime,
        partySize: input.partySize,
        resourceId: input.resourceId,
        customer: { name, contact },
        status: "received",
      };
      reservations.push(reservation);
      return { ok: true, reservation: { ...reservation, customer: { ...reservation.customer } } };
    },
    shopDecide(input) {
      const reservation = reservations.find((r) => r.id === input.reservationId);
      if (!reservation) {
        return { ok: false, error: "NOT_FOUND" };
      }
      if (reservation.status !== "received") {
        return { ok: false, error: "INVALID_STATE" };
      }
      const next: ReservationStatus =
        input.decision === "confirm"
          ? "confirmed"
          : input.decision === "reject"
            ? "rejected"
            : "on_hold";
      reservation.status = next;
      return { ok: true, reservation: { ...reservation, customer: { ...reservation.customer } } };
    },
    transitionStatus(input) {
      const reservation = reservations.find((r) => r.id === input.reservationId);
      if (!reservation) {
        return { ok: false, error: "NOT_FOUND" };
      }
      const allowed: Record<TransitionTarget, ReservationStatus[]> = {
        arrived: ["confirmed"],
        completed: ["arrived", "confirmed"],
        cancelled: ["received", "confirmed", "arrived", "on_hold"],
      };
      if (!allowed[input.to].includes(reservation.status)) {
        return { ok: false, error: "INVALID_STATE" };
      }
      reservation.status = input.to;
      return { ok: true, reservation: { ...reservation, customer: { ...reservation.customer } } };
    },
    listReservations() {
      return reservations.map((r) => ({ ...r, customer: { ...r.customer } }));
    },
    getReservation(id) {
      const reservation = reservations.find((r) => r.id === id);
      return reservation
        ? { ...reservation, customer: { ...reservation.customer } }
        : undefined;
    },
  };
}
