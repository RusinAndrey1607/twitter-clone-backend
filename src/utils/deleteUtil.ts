import fs from "fs";
import path from "path";

export const deleteFile = async (fileName: string) => {
  const filePath = path.resolve(__dirname, "..", "static", fileName);
  await fs.rm(filePath, () => {
    console.log("File was deleted");
  });
};
