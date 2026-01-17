import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { r2Client } from "../bucket-config.ts";
import { logger } from "../logs/prod-app.ts";

// Upload PDF to Bucket
export const uploadPdf = async (
  pdfBuffer: Buffer,
  userId: string,
  year: number,
  month: number,
): Promise<any> => {
  const pdfR2Key = generatePdfIDs(userId, year, month, "pdf");

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: pdfR2Key,
      Body: pdfBuffer,
      ContentType: "application/pdf",
      Metadata: {
        userId: userId,
        month: String(month),
        year: String(year),
        uploadedAt: new Date().toISOString(),
      },
    });

    await r2Client.send(command);

    logger.info(`Uploaded to R2: ${pdfR2Key}`);

    return { success: true, pdfR2Key };
  } catch (error: any) {
    logger.error(`R2 upload error:${error}`);
    throw new Error(`Failed to upload to R2: ${error.message}`);
  }
};

// Download pdf from R2
export const downloadPdf = async (r2Key: string): Promise<Buffer> => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: r2Key,
    });
    const response = await r2Client.send(command);

    if (!response || !response.Body) {
      throw Error("The file doesn't exist");
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const body = response.Body as AsyncIterable<Uint8Array>;

    for await (const chunk of body) {
      chunks.push(chunk);
    }

    const pdfBuffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));

    logger.info(
      `Downloaded from R2: ${r2Key}, size: ${pdfBuffer.length} bytes`,
    );

    return pdfBuffer;
  } catch (error: any) {
    logger.error(`R2 download error: ${error}`);
    throw new Error(`Failed to download from R2: ${error.message}`);
  }
};

// Check the pdf exists in R2
export async function pdfExistsInR2(r2Key: string): Promise<Boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: r2Key,
    });
    await r2Client.send(command);
    logger.info(`Pdf exists for key : ${r2Key}`);
    return true;
  } catch (error) {
    return false;
  }
}
