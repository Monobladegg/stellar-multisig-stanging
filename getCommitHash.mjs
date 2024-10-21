import { execSync } from "child_process";
import axios from "axios";
const getCommitHash = () => {
  return execSync("git rev-parse --short HEAD").toString().trim();
};



export default getCommitHash;
