import fs from "fs";
import path from "path";

export const deleteFile = async (fileName: string) => {
  const filePath = path.resolve(__dirname, "..","static", fileName);
  console.log(filePath);
  await fs.rm(filePath, () => {
    console.log(filePath);

    console.log("File was deleted");
  });
};
