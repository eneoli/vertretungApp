import {Component} from "react";
import * as React from "react";
import {View, StyleSheet, Text} from "react-native";
import {action, observable} from "mobx";
import {observer} from "mobx-react";
import Modal from 'react-native-modal';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
  faBook,
  faCalendarDay,
  faComment,
  faExchangeAlt,
  faSchool,
  faUserAlt,
  faUserFriends
} from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import {PlainText} from "./PlainText";
import {IconText} from "./IconText";
import {ThemeContext} from "../themeContext/theme-context";

moment.locale('de');

interface ItemProps {
  entry: any;
  day: Date;
  hide: boolean;
}

@observer
export class Item extends Component<ItemProps> {

  static contextType = ThemeContext;

  @observable
  private showDetail: boolean = false;
  @observable
  private readonly hide: boolean;

  @action
  private toggleDetail() {
    this.showDetail = !this.showDetail;
  }

  constructor(props: ItemProps) {
    super(props);
    this.hide = this.props.hide;
  }

  private getRootStyles() {
    return StyleSheet.create({
      itemWrapper: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'space-around',
        alignSelf: 'center',
        flexWrap: "wrap",
        backgroundColor: '#FF4136',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        width: '80%',
        minHeight: 30,
        margin: 15,
        textAlign: 'center',
        opacity: this.hide ? 0.7 : 1,
      },
    });
  }

  private getModalStyles() {

    const darkMode = this.context.theme === 'dark';

    return StyleSheet.create({
      view: {
        height: 'auto',
        width: 'auto',
        backgroundColor: darkMode ? '#322f3d' : 'white',
        borderRadius: 5,
        margin: 20
      }
    });
  }

  public render(): React.ReactNode {
    return (
        <View>
          <View style={this.getRootStyles().itemWrapper} onTouchEnd={this.toggleDetail.bind(this)}>
            <Text style={styles.caption}>{this.props.entry.item.hour}</Text>
            <PlainText text={this.props.entry.item.class}/>
            <Text style={styles.text}>
              {this.props.entry.item.subject}{this.props.entry.item.teacher ? ' (' + this.props.entry.item.teacher + ')' : ''}
            </Text>
            <PlainText prepend={'Bemerkung: '} text={this.props.entry.item.comment}/>
          </View>
          <Modal onBackButtonPress={this.toggleDetail.bind(this)} onBackdropPress={this.toggleDetail.bind(this)}
                 isVisible={this.showDetail}>
            <View style={this.getModalStyles().view}>
              <IconText text={this.props.entry.item.hour + ' Stunde, ' + moment(this.props.day).format('dd DD.MM')}
                        icon={faCalendarDay}/>
              <IconText text={this.props.entry.item.class} icon={faUserFriends}/>
              <IconText text={this.props.entry.item.subject} icon={faBook}/>
              <IconText text={this.props.entry.item.room} icon={faSchool}/>
              <IconText text={this.props.entry.item.comment} icon={faComment}/>
              {
                this.props.entry.item.replacement ?
                    <IconText text={this.props.entry.item.teacher} text2={this.props.entry.item.replacement}
                              icon={faExchangeAlt}/> :
                    <IconText text={this.props.entry.item.teacher} icon={faUserAlt}/>
              }
            </View>
          </Modal>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    padding: 0,
    margin: 20,
    color: 'white',
  },
  textAddition: {
    color: 'white',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 5,
    flexBasis: '100%',
    textAlign: 'center',
  },
  caption: {
    textAlign: 'center',
    lineHeight: 55,
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    marginLeft: 10,
  },
  textModal: {
    padding: 5,
    margin: 10,
    fontSize: 18,
    lineHeight: 18,
    color: 'black',
  }
});