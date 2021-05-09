import * as JSEncrypt from "jsencrypt";
import {MoodleProvider} from "./moodle";

export async function encryptLogin(username: string, password: string): Promise<string> {
  let crypto = new JSEncrypt.JSEncrypt();
  let publicKey = await MoodleProvider.getPublicKey();
  crypto.setPublicKey(publicKey);
  return await crypto.encrypt(JSON.stringify({
    username: username,
    password: password
  }));
}