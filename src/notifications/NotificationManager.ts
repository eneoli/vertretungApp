import {AsyncStorage} from "react-native";
import WorkManager from 'react-native-background-worker'
import {SettingsManager} from "../providers/settings";
import {NotificationWork} from "./NotificationWork";

export class NotificationManager {

  private isInitialized: boolean = false;

  private workerId: string | null = null;

  private settingsManager: SettingsManager = new SettingsManager();

  private readonly WORKER_ID_KEY = 'VP_LEO_WORKER_ID';

  private readonly WORKER_SCHEDULE = 15;

  private async save() {
    await AsyncStorage.setItem(this.WORKER_ID_KEY, this.workerId);
  }

  private async getWorkerInfo() {
    await this.init();

    if (this.workerId) {
      return await WorkManager.info(this.workerId);
    }
    return null;
  }

  private async init() {
    if (this.isInitialized) {
      return;
    }

    const workerId = await AsyncStorage.getItem(this.WORKER_ID_KEY);
    if (workerId) {
      this.workerId = workerId;
    }
  }

  public async stop() {
    await this.init();

    if (this.workerId) {
      // success type throws error... library bug
      try {
        await WorkManager.cancel(this.workerId);
      } catch (error) {
      }
      this.workerId = null;
      await AsyncStorage.removeItem(this.WORKER_ID_KEY);
    }
  }

  public async start() {
    await this.init();
    await this.stop();

    const work = new NotificationWork(this.settingsManager);

    this.workerId = await WorkManager.setWorker({
      type: 'periodic',
      name: 'vp_leo_check',
      notification: {
        title: 'Prüfe auf neue Vertretungsstunden',
        text: 'Keine Angst, wir halten dich up to date 😎',
      },
      workflow: work.work.bind(work),
      repeatInterval: this.WORKER_SCHEDULE,
      foregroundBehaviour: 'headlessTask',
    });
    await this.save();
  }

  public async isRunning() {
    await this.init();

    if (this.workerId) {
      const info = await this.getWorkerInfo();
      console.log(info);
      return !(info.state === 'cancelled' || info.state === 'unknown');
    }
    return false;
  }

}