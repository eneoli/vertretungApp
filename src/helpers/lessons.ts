import {Lesson} from "../providers/moodle";
import {ClassSettings} from "../providers/settings";

export class LessonHelper {
  public static isAffected(classSettings: ClassSettings, lesson: Lesson) {
    if (classSettings && classSettings.grade) {
      if (classSettings.grade <= 10) { // 5 -10
        if (classSettings.className) {
          return lesson.class.includes(classSettings.grade + classSettings.className);
        } else {
          return lesson.class.includes('' + classSettings.grade);
        }
      } else if (classSettings.grade >= 11) { // 11 - 13
        const isGrade = lesson.class.includes('' + classSettings.grade);
        const checkCourse = (classSettings.courses && classSettings.courses.length);
        const inCourses = (checkCourse && classSettings.courses.includes(lesson.subject));

        return (isGrade && (!checkCourse || inCourses));
      }
    }
    return true;
  }
}