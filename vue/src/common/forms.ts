import { FormKitData } from "src/interfaces";

function changeFileName(file: File, name: string): File {
  const extention = file.name.split(".").pop();
  const newName = `${name}.${extention}`;
  return new File([file], newName, { type: file.type });
}

export function getFilesFromFormKitData(
  data: FormKitData,
  removeKeys = true,
  renameWithKey = true
): File[] {
  const files: File[] = [];
  for (const key in data) {
    const value = data[key];
    if (!(value instanceof Array)) continue;
    for (const fileValue of value) {
      if (!(typeof fileValue === "object")) continue;
      if (fileValue.file) {
        const file = renameWithKey
          ? changeFileName(fileValue.file, key)
          : fileValue.file;
        files.push(file);
      }
      if (removeKeys) delete data[key];
    }
  }
  return files;
}
