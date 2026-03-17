import { genralConfig } from "../../config";
import { z } from "zod";

type FileValidationOptions = {
  maxSize: number;
  allowedExtensions: string[];
};

const defaultMaxFileSize: number = 2 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export class FileHelpers {
  static formatToUrl(filename: string): string {
    if (filename && filename.indexOf('http') !== -1) {
      return filename;
    }
    return `${genralConfig.imageStoragePrefix}/${filename}`;
  }

  static generateFileSchema = (
      options: FileValidationOptions & { optional?: boolean } = {
        maxSize: defaultMaxFileSize,
        allowedExtensions: ACCEPTED_IMAGE_TYPES,
        optional: false,
      }
  ) => {
    const { maxSize, allowedExtensions, optional } = options;

    const schema = z
        .instanceof(File, { message: "Le fichier est requis." })
        .refine((file) => allowedExtensions.includes(file.type), {
          message: `Le fichier doit être un des types suivants : ${allowedExtensions.join(", ")}.`,
        })
        .refine((file) => file.size <= maxSize, {
          message: `Le fichier ne doit pas dépasser ${maxSize / (1024 * 1024)} Mo.`,
        });

    // Si optionnel, accepter undefined ou null
    if (optional) {
      return z.union([schema, z.null(), z.undefined()]);
    }

    return schema;
  };

}
