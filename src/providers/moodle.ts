export class MoodleProvider {

  public static middlewareUrl: string = "https://vertretung.enes.app";
  public middlewareUrl: string = MoodleProvider.middlewareUrl;

  /**
   * @param username
   * @param password
   */
  public static async login(encryptedCredentials: string): Promise<string> {
    const response: any = await ((await fetch(MoodleProvider.middlewareUrl + "/secureMoodleSession?secret=" + encodeURIComponent(encryptedCredentials))).json());
    if (response.error) {
      throw new Error(response.error);
    } else {
      const moodleSession = response.moodleSession;
      return (moodleSession);
    }
  }

  public static async getPublicKey(): Promise<any> {
    return (((await fetch(this.middlewareUrl + "/publickey")).text()));
  }

  public static async moodleSessionValid(moodleSession: string) {
    return await (await fetch(MoodleProvider.middlewareUrl + '/validateSession?moodleSession=' + moodleSession)).json();
  }

  public static async getPlan(day: 'today' | 'tomorrow', moodleSession: string): Promise<any> {
    return await (await fetch(MoodleProvider.middlewareUrl + "/fetch/" + day + "?moodleSession=" + moodleSession)).json();
  }
}
