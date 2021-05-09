import {Component, ReactNode} from "react";
import {FlatList, ListRenderItemInfo, RefreshControl, ScrollView, Text} from "react-native";
import {Item} from "./Item";
import * as React from 'react';
import {InfoHeader} from "../InfoHeader";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {ThemeContext} from "../themeContext/theme-context";
import {ClassSettings} from "../../providers/settings";

interface Lesson {
  index: number;
  hour: string;
  class: string;
  subject: string;
  teacher: string;
  replacement: string;
  room: string;
  comment: string;
}

interface PlanViewProps {
  plan: any;
  onRefresh: () => void;
  classSettings: ClassSettings;
}

@observer
export class PlanView extends Component<PlanViewProps> {

  static contextType = ThemeContext;

  @observable
  private refreshing: boolean = false;

  constructor(props: PlanViewProps) {
    super(props);
  }

  private isAffected(lesson: Lesson) {
    const classSettings = this.props.classSettings;
    if (classSettings && classSettings.grade) {
      if (classSettings.grade <= 10) { // 5 -10
        return lesson.class.includes(classSettings.grade + classSettings.className);
      } else if (classSettings.grade >= 13) { // 11 - 13
        const isGrade = lesson.class.includes('' + classSettings.grade);
        const checkCourse = (classSettings.courses && classSettings.courses.length);
        const inCourses = (classSettings.courses && classSettings.courses.includes(lesson.subject));

        return (isGrade && (!checkCourse || inCourses));
      }
    }
    return true;
  }

  public render(): ReactNode {
    return (
        <ScrollView
            style={{
              backgroundColor: this.context.theme == 'light' ? '#FFFFFF' : '#282c3d',
            }}
            refreshControl={<RefreshControl refreshing={this.refreshing} onRefresh={() => {
              this.refreshing = true;
              this.props.onRefresh();
              this.refreshing = false;
            }}/>}>
          <InfoHeader day={this.props.plan.date}
                      missingTeachers={this.props.plan.missingTeachers}
                      usedTeachers={this.props.plan.usedTeachers}/>
          <FlatList scrollEnabled={false}
                    data={this.props.plan.lessons}
                    renderItem={(lesson: ListRenderItemInfo<Lesson>) => (
                        <Item key={lesson.index}
                              hide={this.isAffected(lesson.item)}
                              entry={lesson}
                              day={(this.props.plan.date)}/>
                    )}/>
          <Text>Alle Angaben ohne Gewähr!</Text>
        </ScrollView>
    );
  }
}