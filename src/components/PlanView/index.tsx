import {Component, ReactNode} from "react";
import {AsyncStorage, FlatList, RefreshControl, ScrollView, Text} from "react-native";
import {Item} from "./Item";
import * as React from 'react';
import {InfoHeader} from "../InfoHeader";
import {observer} from "mobx-react";
import {observable} from "mobx";

interface IPlanViewProps {
  plan: any;
  onRefresh: () => void;
  studentClass: string;
}

@observer
export class PlanView extends Component<IPlanViewProps> {
  @observable
  private refreshing: boolean = false;

  constructor(props: IPlanViewProps) {
    super(props);
  }

  public render(): ReactNode {
    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={this.refreshing} onRefresh={() => {
              this.refreshing = true;
              this.props.onRefresh();
              this.refreshing = false;
            }}/>}>
          <InfoHeader day={this.props.plan.date} missingTeachers={this.props.plan.missingTeachers}
                      usedTeachers={this.props.plan.usedTeachers}/>
          <FlatList scrollEnabled={false} data={this.props.plan.lessons} renderItem={(e: any) => {
            if (this.props.studentClass == null) {
              return <Item key={e.index} hide={false} entry={e} day={(this.props.plan.date)}/>
            } else {
              return <Item key={e.index} hide={!(this.props.studentClass == e.item.class.trim())} entry={e} day={(this.props.plan.date)}/>;
            }
          }}/>
          <Text>Alle Angaben ohne Gewähr!</Text>
        </ScrollView>
    );
  }
}