import {existsSync, mkdirSync} from "fs";
import {DIRECTORIES_ARRAY} from "../constants/directories";

const createDirectories = () => {
  DIRECTORIES_ARRAY.forEach((directory: string) => {
    if (!existsSync(directory)) {
      mkdirSync(directory)
    }
  })
};

export default createDirectories;
