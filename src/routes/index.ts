import express from "express";

export const router = express.Router();

enum AccessRoles {
  USER = "user",
  ADMIN = "admin",
  MAIN_ADMIN = "main_admin",
  DEVELOPER = "developer",
}

const DEV_ACCESS = process.env.DEV_ACCESS
  ? (process.env.DEV_ACCESS.split(",") as AccessRoles[])
  : [];
// const MAIN_ACCESS = process.env.MAIN_ACCESS.split(',');
const ADMIN_ACCESS = process.env.ADMIN_ACCESS
  ? (process.env.ADMIN_ACCESS.split(",") as AccessRoles[])
  : [];
// const USER_ACCESS = process.env.USER_ACCESS.split(',');

import { upload, processAndSaveImage } from "../middleware/multerConfig";
import { verifyToken } from "../middleware/verifyToken";
import { checkRole } from "../middleware/checkRole";

import { AuthController } from "../services/users/controllers/authController";
import { UserController } from "../services/users/controllers/userController";
import { HouseController } from "../services/houses/controllers/houseController";
import { ApartController } from "../services/aparts/controllers/apartController";
import { RoomController } from "../services/rooms/controllers/roomController";
import { HousesPicturesController } from "../services/houses/controllers/housesPicturesController";
import { ApartsPicturesController } from "../services/aparts/controllers/apartsPicturesController";
import { RoomsPicturesController } from "../services/rooms/controllers/roomsPicturesController";

import { BookingController } from "../services/bookings/controllers/bookingController";

import { sendModalCallback } from "../services/telegram/controllers/tgBotController";

// users
router.get("/test", UserController.test);
router.get(
  "/users",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  UserController.getUsers
);
router.get(
  "/users/:userId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  UserController.getOneUser
);
router.post(
  "/users",
  verifyToken,
  checkRole(DEV_ACCESS),
  upload.none(),
  UserController.createUser
);
router.patch(
  "/users/:userId",
  verifyToken,
  checkRole(DEV_ACCESS),
  upload.none(),
  UserController.updateUser
);
router.delete(
  "/users/:userId",
  verifyToken,
  checkRole(DEV_ACCESS),
  UserController.deleteUser
);

// auth
// router.post('/registration', authController.registration)
// router.post('/createRoles', authController.createRole)
router.post("/login", AuthController.login);
router.get("/getRoles", AuthController.getRoles);
router.get(
  "/getUserRoles",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  AuthController.getUserRoles
);
// проверка валидности токена
router.get("/validate-token", verifyToken, AuthController.validateToken);

// houses
router.get("/houses", HouseController.getHouses);
router.get("/houses/:houseId", HouseController.getOneHouse);
router.post(
  "/houses",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  upload.none(),
  HouseController.createHouse
);
router.patch(
  "/houses/:houseId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  upload.none(),
  HouseController.updateHouse
);
router.delete(
  "/houses/:houseId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  HouseController.deleteHouse
);
// aparts
router.get("/aparts", ApartController.getAparts);
router.get("/aparts/:apartId", ApartController.getOneApart);
router.post(
  "/aparts",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  upload.none(),
  ApartController.createApart
);
router.patch(
  "/aparts/:apartId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  upload.none(),
  ApartController.updateApart
);
router.delete(
  "/aparts/:apartId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  ApartController.deleteApart
);
// rooms
router.get("/rooms", RoomController.getAllRooms);
router.get("/rooms/:houseId", RoomController.getRooms);
router.get("/rooms/:houseId/:roomId", RoomController.getOneRoom);
router.post(
  "/rooms/:houseId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  upload.none(),
  RoomController.createRoom
);
router.patch(
  "/rooms/:houseId/:roomId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  upload.none(),
  RoomController.updateRoom
);
router.delete(
  "/rooms/:houseId/:roomId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  RoomController.deleteRoom
);
// houses pictures
router.get("/house/pictures", HousesPicturesController.getAllPictures);
router.get("/house/:houseId/pictures", HousesPicturesController.getPictures);
router.get(
  "/house/:houseId/pictures/:imageId",
  HousesPicturesController.getOnePicture
);
router.post(
  "/house/:houseId/pictures",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  upload.array("housesPictures", 10),
  processAndSaveImage,
  HousesPicturesController.uploadPictures
);
router.delete(
  "/house/:houseId/pictures/:imageId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  HousesPicturesController.deletePicture
);
// aparts pictures
router.get("/apart/pictures", ApartsPicturesController.getAllPictures);
router.get("/apart/:apartId/pictures", ApartsPicturesController.getPictures);
router.get(
  "/apart/:apartId/pictures/:imageId",
  ApartsPicturesController.getOnePicture
);
router.post(
  "/apart/:apartId/pictures",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  upload.array("apartsPictures", 10),
  processAndSaveImage,
  ApartsPicturesController.uploadPictures
);
router.delete(
  "/apart/:apartId/pictures/:imageId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  ApartsPicturesController.deletePicture
);
// rooms pictures
router.get("/room/pictures", RoomsPicturesController.getAllPictures);
router.get("/room/:roomId/pictures", RoomsPicturesController.getPictures);
router.get(
  "/room/:roomId/pictures/:imageId",
  RoomsPicturesController.getOnePicture
);
router.post(
  "/room/:roomId/pictures",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  upload.array("roomsPictures", 10),
  processAndSaveImage,
  RoomsPicturesController.uploadPictures
);
router.delete(
  "/room/:roomId/pictures/:imageId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  RoomsPicturesController.deletePicture
);

// booking
router.get("/reservedDates", BookingController.getReservedDates);
router.get(
  "/booking",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  BookingController.getBookings
);
router.get(
  "/booking/:bookingId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  BookingController.getOneBooking
);
router.post("/booking", BookingController.createBooking);
router.patch(
  "/booking/:bookingId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  BookingController.updateBooking
);
router.delete(
  "/booking/:bookingId",
  verifyToken,
  checkRole(ADMIN_ACCESS),
  BookingController.deleteBooking
);
// tgBot
router.post("/callback-modal", sendModalCallback);
