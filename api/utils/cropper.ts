import sharp from "sharp";

export const resizeImage = async (
  file: Buffer,
  width: number,
  height: number
): Promise<Buffer> => {
  try {
    return await sharp(file).resize(width, height).toBuffer();
  } catch (error) {
    throw error;
  }
};
