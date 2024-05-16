import { router } from '../index';

import { ApartController } from './controllers/apartController';
import { ApartsPicturesController } from './controllers/apartsPicturesController';
import { checkRole } from '../../middleware/checkRole';
import { upload, processAndSaveImage } from '../../middleware/multerConfig';
import { verifyToken } from '../../middleware/verifyToken';



enum AccessRoles {
  USER = "user",
  ADMIN = "admin",
  MAIN_ADMIN = "main_admin",
  DEVELOPER = "developer",
}

// const DEV_ACCESS = process.env.DEV_ACCESS
//   ? (process.env.DEV_ACCESS.split(",") as AccessRoles[])
//   : [];
// const MAIN_ACCESS = process.env.MAIN_ACCESS.split(',');
const ADMIN_ACCESS = process.env.ADMIN_ACCESS
  ? (process.env.ADMIN_ACCESS.split(",") as AccessRoles[])
  : [];
// const USER_ACCESS = process.env.USER_ACCESS.split(',');


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

export { router };