import {SettingsManager} from "../providers/settings";
import {Lesson, MoodleProvider} from "../providers/moodle";
import {LessonHelper} from "../helpers/lessons";
import PushNotification from "react-native-push-notification";

interface NotifyTask {
  lessonsToday: Lesson[];
  lessonsTomorrow: Lesson[];
}

export class NotificationWork {

  private settingsManager: SettingsManager;

  private lastNotificationTask: NotifyTask | null = null;

  private static readonly notificationChannelId: string = 'vp_leo_notification';

  constructor(settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
  }

  private async channelExists(): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      PushNotification.channelExists(NotificationWork.notificationChannelId, (exists: boolean) => {
        resolve(exists);
      })
    })
  }

  private deleteChannel() {
    PushNotification.deleteChannel(NotificationWork.notificationChannelId);
  }

  private async createChannel() {

    if (await this.channelExists()) {
      this.deleteChannel();
    }

    return new Promise((resolve, _reject) => {
      PushNotification.createChannel({
        channelId: NotificationWork.notificationChannelId,
        channelName: 'Vertretungsplan am Leo',
        channelDescription: 'Benachrichtigungen zu Vertretungsstunden',
        playSound: true,

      }, (created) => {
        if (!created) {
          throw new Error('Notification channel could not be created.')
        }
        resolve();
      })
    });
  }

  private generateNotificationText(task: NotifyTask) {
    let message = 'Folgende Stunden sind betroffen:\n';

    if (task.lessonsToday && task.lessonsToday.length) {
      message += 'Heute:\n';
    }

    for (const lesson of task.lessonsToday) {
      message += lesson.hour + ' ' + lesson.subject + ' (' + lesson.teacher + ')\n';
    }

    if (task.lessonsTomorrow && task.lessonsTomorrow.length) {
      message += '\nMorgen:\n';
    }

    for (const lesson of task.lessonsTomorrow) {
      message += lesson.hour + ' ' + lesson.subject + ' (' + lesson.teacher + ')\n';
    }

    message += '\nGrundsätzlich gilt nur der Plan am schwarzen Brett!';

    return message;
  }

  public async notify(task: NotifyTask) {

    const channelExists = await this.channelExists();

    if (!channelExists) {
      await this.createChannel();
    }

    PushNotification.localNotification({
      channelId: NotificationWork.notificationChannelId,
      title: 'Du hast Vertretung',
      bigLargeIcon: 'icon',
      largeIcon: 'icon',
      smallIcon: 'icon',
      message: this.generateNotificationText(task),
    });

    this.lastNotificationTask = task;
  }

  public async work() {
    const settings = await this.settingsManager.load();
    const classSettings = settings.classSettings;
    const moodleSession = await MoodleProvider.login(settings.userAuth);
    const today = await MoodleProvider.getPlan('today', moodleSession);
    const tomorrow = await MoodleProvider.getPlan('tomorrow', moodleSession);

    const task: NotifyTask = {
      lessonsToday: [],
      lessonsTomorrow: [],
    }

    let second = false;
    for (const day of [today, tomorrow]) {
      let alreadyNotifiedLessons = [];
      if (this.lastNotificationTask) {
        alreadyNotifiedLessons = second ? this.lastNotificationTask.lessonsTomorrow : this.lastNotificationTask.lessonsToday;
      }
      const affectedLessons = day.lessons.filter((lesson) => LessonHelper.isAffected(classSettings, lesson));
      const newLessons = affectedLessons.filter((lesson) => !alreadyNotifiedLessons.includes(lesson));
      const container = second ? task.lessonsTomorrow : task.lessonsToday;

      container.push(...newLessons);

      second = true;
    }

    if (task.lessonsToday.length || task.lessonsTomorrow.length) {
      await this.notify(task);
    }
  }
}