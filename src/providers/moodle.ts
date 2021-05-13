export interface SubstitutionPlan {
  date: string;
  state: string;
  missingTeachers: string;
  usedTeachers: string;
  lessons: Lesson[];
}

export interface Lesson {
  index: number;
  hour: string;
  class: string;
  subject: string;
  teacher: string;
  replacement: string;
  room: string;
  comment: string;
}

export class MoodleProvider {

  public static middlewareUrl: string = "https://vertretung.leoninum.org";

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

  public static async getPublicKey(): Promise<string> {
    return (((await fetch(this.middlewareUrl + "/publickey")).text()));
  }

  public static async moodleSessionValid(moodleSession: string) {
    return await (await fetch(MoodleProvider.middlewareUrl + '/?moodleSession=' + moodleSession)).json();
  }

  public static async getPlan(day: 'today' | 'tomorrow', moodleSession: string): Promise<SubstitutionPlan> {
    return await (await fetch(MoodleProvider.middlewareUrl + "/fetch/" + day + "?moodleSession=" + moodleSession)).json();
  }
}
