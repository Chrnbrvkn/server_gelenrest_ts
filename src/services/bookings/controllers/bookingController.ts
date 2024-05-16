import { BadRequestError, NotFoundError } from "../../../errors/ApiError";
import { Bookings } from "../models/Bookings";
import { sendToTelegramBot } from "../../telegram/controllers/tgBotController";
import { NextFunction, Request, Response } from "express";

export class BookingController {
  static async getReservedDates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

      if (bookings.length === 0) {
        return res.json([]);
      }

      return res.json(bookings);
    } catch (e) {
      next(e);
    }
  }

  static async getBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await Bookings.findAll();
      if (bookings.length === 0) {
        return res.json([]);
      }
      return res.json(bookings);
    } catch (e) {
      next(e);
    }
  }

  static async getOneBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        throw new BadRequestError(`Не верный ID квартиры: ${bookingId}`);
      }

      const booking = await Bookings.findByPk(bookingId);
      if (!booking) {
        throw new NotFoundError(`Бронирование с ID: ${bookingId} не найдена.`);
      }

      return res.json(booking);
    } catch (e) {
      next(e);
    }
  }

  static async createBooking(req: Request, res: Response, next: NextFunction) {
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

      await sendToTelegramBot(bookingInfo, next);
      return res.json(booking);
    } catch (e) {
      next(e);
    }
  }

  static async updateBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        throw new BadRequestError(`Не верный ID бронирования: ${bookingId}`);
      }
      const booking = await Bookings.findByPk(bookingId);
      if (!booking) {
        throw new NotFoundError(`Бронирование с ID: ${bookingId} не найдена.`);
      }

      await booking.update(req.body);
      const updatedBooking = await Bookings.findByPk(bookingId);
      return res.json(updatedBooking);
    } catch (e) {
      next(e);
    }
  }

  static async deleteBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        throw new BadRequestError(`Не верный ID бронирования: ${bookingId}`);
      }
      const booking = await Bookings.findByPk(bookingId);
      if (!booking) {
        throw new NotFoundError(`Бронирование с ID: ${bookingId} не найдена.`);
      }
      await booking.destroy();
      return res.json({ message: "Booking deleted" });
    } catch (e) {
      next(e);
    }
  }
}
