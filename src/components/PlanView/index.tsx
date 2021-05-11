import {Component, ReactNode} from "react";
import {FlatList, ListRenderItemInfo, RefreshControl, ScrollView, Text} from "react-native";
import {Item} from "./Item";
import * as React from 'react';
import {InfoHeader} from "../InfoHeader";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {ThemeContext} from "../themeContext/theme-context";
import {ClassSettings} from "../../providers/settings";
import {Lesson} from "../../providers/moodle";
import {LessonHelper} from "../../helpers/lessons";

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
                              hide={!LessonHelper.isAffected(this.props.classSettings, lesson.item)}
                              entry={lesson}
                              day={(this.props.plan.date)}/>
                    )}/>
          <Text>Alle Angaben ohne Gewähr!</Text>
        </ScrollView>
    );
  }
}