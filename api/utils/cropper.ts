import sharp from "sharp";

export const resizeImage = async (
  file: Buffer,
  height: number,
  width: number
): Promise<Buffer> => {
  try {
    return await sharp(file).resize(width, height).toBuffer();
  } catch (error) {
    throw error;
  }
};
