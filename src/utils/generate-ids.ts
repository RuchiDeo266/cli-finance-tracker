// Generate R2 key for PDF
export const generatePdfIDs = (
  userId: string,
  year: number,
  month: number,
  typeOfReport = "pdf",
) => {
  return `pdfs/${userId}/${year}/${month}/${typeOfReport}.pdf`;
};
