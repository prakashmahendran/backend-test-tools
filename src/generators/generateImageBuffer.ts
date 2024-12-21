import sharp from 'sharp';

/** Generate a random image buffer */
export async function generateRandomImageBuffer(
  width: number = 150,
  height: number = 150
): Promise<Buffer> {
  // Create a blank image buffer
  const buffer = Buffer.alloc(width * height * 3); // RGB buffer (no alpha channel)

  // Fill the buffer with random colors
  for (let i = 0; i < buffer.length; i += 3) {
    buffer[i] = Math.floor(Math.random() * 256);     // Red
    buffer[i + 1] = Math.floor(Math.random() * 256); // Green
    buffer[i + 2] = Math.floor(Math.random() * 256); // Blue
  }

  // Use sharp to create an image from the buffer and convert it to PNG
  const imageBuffer = await sharp(buffer, {
    raw: {
      width: width,
      height: height,
      channels: 3 // RGB
    }
  })
    .toFormat('png') // Convert to PNG format
    .toBuffer(); // Return the image buffer

  return imageBuffer;
}