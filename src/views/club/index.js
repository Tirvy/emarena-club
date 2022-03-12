import React from "react";
import {
  Panel,
  PanelHeader,
  Group,
  View,
  Div,
  FixedLayout,
  Button
} from "@vkontakte/vkui";
import Icon16UserAdd from "@vkontakte/icons/dist/16/user_add";
import { db } from "../../firebase";
import PanelVisiterEditing from "../../panels/visiter-editing.js";

import ListCurrentVisiters from "./list-current-visiters";
import ModalCheckout from "./modal-checkout";

class Club extends React.Component {
  constructor(props) {
    super(props);

    let params = new URL(document.location).searchParams;

    let isAdmin = false;
    if (params.get("vk_user_id") === "16361098") {
      isAdmin = true;
    }
    let unsubscribeCallbacks = [];

    unsubscribeCallbacks.push(
      db.collection("visits").where('end', '==', null).onSnapshot(querySnapshot => {
        this.setState({ visits: querySnapshot.docs });
      })
    );

    const rerenderCancel = setInterval(() => {
      this.forceUpdate();
    }, 1000 * 60);

    this.state = {
      visits: [],
      activePanel: "currentList",
      isAdmin,
      unsubscribeCallbacks,
      rerenderCancel,
      currentEditing: null
    };
  }

  componentWillUnmount = () => {
    this.state.unsubscribeCallbacks.forEach(func => func());
    clearInterval(this.state.rerenderCancel);
  };

  initCheckout = visit_id => {
    const visit = this.state.visits.find(visit => visit.id === visit_id);
    this.setState({
      checkoutVisit: visit
    });
  };

  cancelCheckout = () => {
    this.setState({
      checkoutVisit: null
    });
  };

  saveCheckout = data => {
    db.collection("visits")
      .doc(data.id)
      .set({
        end: new Date(),
        check_sum: data.check_sum,
        check_type: data.check_type
      }, { merge: true });
  };

  editVisiter = visiter_id => {
    const visiter = this.props.visiters.find(
      visiter => visiter.id === visiter_id
    );
    this.setState({
      currentEditing: {
        id: visiter.id,
        name: visiter.name,
        description: visiter.description
      }
    });
  };

  TotalCount = () => {
    const number = this.state.visits.filter(visit => !visit.data().end).length;
    return (
      <Group>
        <Div>Сейчас людей на аренке: {number}</Div>
      </Group>
    );
  };

  AdminUI = () => {
    if (this.state.isAdmin) {
      return (
        <Group>
          <ListCurrentVisiters
            visits={this.state.visits}
            visiters={this.props.visiters}
            removeVisit={this.initCheckout}
            editVisiter={this.editVisiter}
          />
        </Group>
      );
    }
  };

  BottomAddition = () => {
    if (global.DESIGN === "vika" && this.state.isAdmin) {
      return (
        <FixedLayout vertical="bottom">
          <Div>
            <Button
              stretched
              onClick={this.props.goToVisiters}
              before={<Icon16UserAdd />}
            >
              Добавить посещение
            </Button>
          </Div>
        </FixedLayout>
      );
    }
  };

  getCurrentPanel = () => {
    if (this.state.currentEditing) {
      return "editing";
    }
    return "club";
  };

  render() {
    return (
      <View
        id="club"
        activePanel={this.getCurrentPanel()}
        modal={
          <ModalCheckout
            cancel={this.cancelCheckout}
            save={this.saveCheckout}
            visit={this.state.checkoutVisit}
          ></ModalCheckout>
        }
      >
        <Panel id="club">
          <PanelHeader>Сейчас на аренке</PanelHeader>
          {this.TotalCount()}
          {this.AdminUI()}
          {this.BottomAddition()}
        </Panel>
        <PanelVisiterEditing
          id="editing"
          visiter={this.state.currentEditing}
          visiters={this.props.visiters}
          goBack={() => this.setState({ currentEditing: null })}
        ></PanelVisiterEditing>
      </View>
    );
  }
}

export default Club;
