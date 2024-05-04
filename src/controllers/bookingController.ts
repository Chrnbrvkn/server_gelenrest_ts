import { Bookings } from "../models/models";
import { sendToTelegramBot } from "./tgBotController";
import { Request, Response } from "express";

export class BookingController {
  static async getReservedDates(req: Request, res: Response) {
    try {
      const bookings = await Bookings.findAll({
        attributes: [
          "houseId",
          "roomId",
          "apartId",
          "checkInDate",
          "checkOutDate",
        ],
        where: {
          status: "Подтверждён",
        },
      });
      return res.json(bookings);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async getBookings(req: Request, res: Response) {
    try {
      const bookings = await Bookings.findAll();
      if (bookings.length === 0) {
        return res.json([]);
      }
      return res.json(bookings);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async getOneBooking(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        return res.status(400).json({ error: "ID not specified" });
      }
      const booking = await Bookings.findByPk(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      return res.json(booking);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async createBooking(req: Request, res: Response) {
    try {
      const booking = await Bookings.create({ ...req.body });

      const bookingInfo = `Новая бронь ${booking.id}:
      \nИмя: ${req.body.guestName}
      \nНомер: ${
        req.body.houseName === ""
          ? req.body.itemName
          : req.body.houseName + " " + req.body.itemName
      }
      \nАдрес: ${req.body.address}
      \nТелефон: ${req.body.guestContact}
      \nДата: ${req.body.checkInDate.slice(
        0,
        10
      )} - ${req.body.checkOutDate.slice(0, 10)}`;

      await sendToTelegramBot(bookingInfo);
      return res.json(booking);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async updateBooking(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        return res.status(400).json({ error: "ID not specified" });
      }
      const booking = await Bookings.findByPk(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      await booking.update(req.body);
      const updatedBooking = await Bookings.findByPk(bookingId);
      return res.json(updatedBooking);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }

  static async deleteBooking(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        return res.status(400).json({ error: "ID not specified" });
      }
      const booking = await Bookings.findByPk(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      await booking.destroy();
      return res.json({ message: "Booking deleted" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
}
