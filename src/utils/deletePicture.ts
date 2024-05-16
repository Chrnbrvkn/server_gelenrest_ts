import fs from "fs";
import { InternalServerError } from "../errors/ApiError";

export const deletePicture = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    } else {
      console.error(`Файл не найден: ${filePath}`);
      throw new InternalServerError(`Файл не найден: ${filePath}`);
    }
  } catch (e) {
    throw new InternalServerError(
      `Не удалось удалить картинку: ${filePath}, ошибка: ${JSON.stringify(e)}`
    );
  }
};
