import * as JSEncrypt from "jsencrypt";
import {MoodleProvider} from "./moodle";

export async function encryptLogin(username: string, password: string): Promise<string> {
  let crypto = new JSEncrypt.JSEncrypt();
  let publicKey = await MoodleProvider.getPublicKey();

  const data = JSON.stringify({
    username: username,
    password: password,
  });

  crypto.setPublicKey(publicKey);
  const cryptedData = crypto.encrypt(data);
  if (!cryptedData) {
    throw new Error('Konnte Daten nicht verschlüsseln');
  }
  return cryptedData;
}