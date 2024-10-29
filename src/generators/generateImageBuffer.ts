import Jimp from 'jimp';
import {generateImageBufferOptions} from './generateImageBuffer.types';

/** Generate a binary buffer containing a PNG image */
export async function generateImageBuffer(
  options: generateImageBufferOptions = {},
): Promise<Buffer> {
  const image = await generateImage(options);
  return image.getBufferAsync(Jimp.MIME_PNG);
}

/** Generate the asynchronously image using Jimp */
async function generateImage(options: generateImageBufferOptions = {}): Promise<Jimp> {
  return new Promise<Jimp>((resolve) => {
    new Jimp(options.width ?? 150, options.height ?? 150, function (err, image) {
      resolve(image);
    });
  });
}
