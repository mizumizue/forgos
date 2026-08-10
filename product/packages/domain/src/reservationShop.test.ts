import { describe, expect, it } from "vitest";
import { createReservationShop } from "./reservationShop.js";

function openShop() {
  return createReservationShop({
    businessHours: { open: "10:00", close: "12:00", slotMinutes: 60 },
    closedDates: ["2026-08-15"],
    resources: [
      { id: "table-a", name: "席A", capacity: 4 },
      { id: "table-b", name: "席B", capacity: 2 },
    ],
  });
}

describe("reservationShop public interface", () => {
  it("returns no bookable slots on a closed date (D1)", () => {
    const shop = openShop();
    const slots = shop.listSlots({ date: "2026-08-15", resourceId: "table-a" });
    expect(slots).toEqual([]);
  });

  it("lists slots with capacity for an open date and resource (D2/D3)", () => {
    const shop = openShop();
    const slots = shop.listSlots({ date: "2026-08-11", resourceId: "table-a" });
    expect(slots).toEqual([
      {
        date: "2026-08-11",
        startTime: "10:00",
        resourceId: "table-a",
        capacity: 4,
        occupied: 0,
        remaining: 4,
      },
      {
        date: "2026-08-11",
        startTime: "11:00",
        resourceId: "table-a",
        capacity: 4,
        occupied: 0,
        remaining: 4,
      },
    ]);
  });

  it("checks availability for date, party size, and resource (D2/D3/D6)", () => {
    const shop = openShop();
    expect(
      shop.checkAvailability({
        date: "2026-08-11",
        startTime: "10:00",
        partySize: 3,
        resourceId: "table-a",
      }),
    ).toEqual({ available: true, remaining: 4 });

    expect(
      shop.checkAvailability({
        date: "2026-08-11",
        startTime: "10:00",
        partySize: 5,
        resourceId: "table-a",
      }).available,
    ).toBe(false);

    expect(
      shop.checkAvailability({
        date: "2026-08-15",
        startTime: "10:00",
        partySize: 1,
        resourceId: "table-a",
      }),
    ).toEqual({ available: false, reason: "CLOSED" });
  });

  it("applies as received with customer info, not confirmed (D4/D5/D6)", () => {
    const shop = openShop();
    const result = shop.applyReservation({
      date: "2026-08-11",
      startTime: "10:00",
      partySize: 2,
      resourceId: "table-a",
      customer: { name: "山田", contact: "090-0000-0000" },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reservation.status).toBe("received");
    expect(result.reservation.customer.name).toBe("山田");
    expect(result.reservation.resourceId).toBe("table-a");
  });

  it("rejects apply when customer missing or capacity exceeded (D2/D4)", () => {
    const shop = openShop();
    expect(
      shop.applyReservation({
        date: "2026-08-11",
        startTime: "10:00",
        partySize: 2,
        resourceId: "table-a",
        customer: { name: "  ", contact: "090" },
      }),
    ).toEqual({ ok: false, error: "CUSTOMER_REQUIRED" });

    shop.applyReservation({
      date: "2026-08-11",
      startTime: "10:00",
      partySize: 2,
      resourceId: "table-b",
      customer: { name: "A", contact: "1" },
    });
    expect(
      shop.applyReservation({
        date: "2026-08-11",
        startTime: "10:00",
        partySize: 1,
        resourceId: "table-b",
        customer: { name: "B", contact: "2" },
      }),
    ).toEqual({ ok: false, error: "CAPACITY" });
  });

  it("lets shop confirm, reject, or hold only from received (D5/D6)", () => {
    const shop = openShop();
    const applied = shop.applyReservation({
      date: "2026-08-11",
      startTime: "10:00",
      partySize: 1,
      resourceId: "table-a",
      customer: { name: "C", contact: "3" },
    });
    if (!applied.ok) throw new Error("apply failed");
    const id = applied.reservation.id;

    expect(shop.shopDecide({ reservationId: id, decision: "confirm" }).ok).toBe(true);
    expect(shop.getReservation(id)?.status).toBe("confirmed");
    expect(shop.shopDecide({ reservationId: id, decision: "reject" }).ok).toBe(false);

    const held = shop.applyReservation({
      date: "2026-08-11",
      startTime: "11:00",
      partySize: 1,
      resourceId: "table-a",
      customer: { name: "D", contact: "4" },
    });
    if (!held.ok) throw new Error("apply failed");
    expect(shop.shopDecide({ reservationId: held.reservation.id, decision: "hold" }).ok).toBe(
      true,
    );
    expect(shop.getReservation(held.reservation.id)?.status).toBe("on_hold");
  });

  it("tracks status transitions and restores capacity on cancel (D5/D7/D9)", () => {
    const shop = openShop();
    const applied = shop.applyReservation({
      date: "2026-08-11",
      startTime: "10:00",
      partySize: 2,
      resourceId: "table-b",
      customer: { name: "E", contact: "5" },
    });
    if (!applied.ok) throw new Error("apply failed");
    const id = applied.reservation.id;
    shop.shopDecide({ reservationId: id, decision: "confirm" });
    expect(shop.transitionStatus({ reservationId: id, to: "arrived" }).ok).toBe(true);
    expect(shop.getReservation(id)?.status).toBe("arrived");
    expect(shop.transitionStatus({ reservationId: id, to: "completed" }).ok).toBe(true);

    const second = shop.applyReservation({
      date: "2026-08-11",
      startTime: "11:00",
      partySize: 2,
      resourceId: "table-b",
      customer: { name: "F", contact: "6" },
    });
    if (!second.ok) throw new Error("apply failed");
    expect(
      shop.checkAvailability({
        date: "2026-08-11",
        startTime: "11:00",
        partySize: 1,
        resourceId: "table-b",
      }).available,
    ).toBe(false);

    expect(
      shop.transitionStatus({ reservationId: second.reservation.id, to: "cancelled" }).ok,
    ).toBe(true);
    expect(
      shop.checkAvailability({
        date: "2026-08-11",
        startTime: "11:00",
        partySize: 2,
        resourceId: "table-b",
      }),
    ).toEqual({ available: true, remaining: 2 });

    const listed = shop.listReservations();
    expect(listed.map((r) => ({ id: r.id, status: r.status, partySize: r.partySize }))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id, status: "completed", partySize: 2 }),
        expect.objectContaining({
          id: second.reservation.id,
          status: "cancelled",
          partySize: 2,
        }),
      ]),
    );
  });
});
