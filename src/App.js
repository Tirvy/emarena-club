import React from "react";
import connect from "@vkontakte/vkui-connect";
import { Root, View, Epic, TabbarItem, Tabbar } from "@vkontakte/vkui";
import Icon28Profile from "@vkontakte/icons/dist/28/profile";
import Icon28UserAddOutline from "@vkontakte/icons/dist/28/user_add_outline";
import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import "@vkontakte/vkui/dist/vkui.css";

import Home from "./panels/Home";
import Persik from "./panels/Persik";
import Club from "./views/club";
import Visiters from "./views/visiters";
import Report from "./views/report";

import { db } from "./firebase";

class App extends React.Component {
  constructor(props) {
    super(props);

    let params = new URL(document.location).searchParams;
    let isAdmin = false;
    let unsubscribeCallbacks = [];
    if (params.get("vk_user_id") === "16361098") {
      isAdmin = true;

      unsubscribeCallbacks.push(
        db.collection("customers").orderBy("date", "desc").limit(1).onSnapshot(querySnapshot => {
          this.setState({ visiters: querySnapshot.docs[0].data().list });
        })
      );

    }

    this.state = {
      activeStory: "club",
      activePanel: "home",
      isAdmin: isAdmin,
      unsubscribeCallbacks,
      visiters: [],
      fetchedUser: null
    };
    this.onStoryChange = this.onStoryChange.bind(this);
  }

  componentWillUnmount = () => {
    this.state.unsubscribeCallbacks.forEach(func => func());
  };

  onStoryChange(e) {
    this.setState({ activeStory: e.currentTarget.dataset.story });
  }

  componentDidMount() {
    connect.subscribe(e => {
      switch (e.detail.type) {
        case "VKWebAppGetUserInfoResult":
          this.setState({ fetchedUser: e.detail.data });
          break;
        default:
        // console.log(e.detail.type);
      }
    });
    connect.send("VKWebAppGetUserInfo", {});
  }

  go = e => {
    this.setState({ activePanel: e.currentTarget.dataset.to });
  };

  //   <TabbarItem
  //     onClick={this.onStoryChange}
  //     selected={this.state.activeStory === 'games'}
  //     data-story="games"
  //     text="Игры"
  //   ><Icon28Search  /></TabbarItem>
  //   <TabbarItem
  //     onClick={this.onStoryChange}
  //     selected={this.state.activeStory === 'links'}
  //     data-story="links"
  //     text="Ссылки"
  //   ><Icon28More  /></TabbarItem>
  render() {
    if (global.DESIGN === "ernie" && this.state.isAdmin) {
      return (
        <Epic
          activeStory={this.state.activeStory}
          tabbar={
            <Tabbar>
              <TabbarItem
                onClick={this.onStoryChange}
                selected={this.state.activeStory === "club"}
                data-story="club"
                text="В клубе"
              >
                <Icon28Profile />
              </TabbarItem>
              <TabbarItem
                onClick={this.onStoryChange}
                selected={this.state.activeStory === "visiters"}
                data-story="visiters"
                text="Добавить"
              >
                <Icon28UserAddOutline />
              </TabbarItem>
              <TabbarItem
                onClick={this.onStoryChange}
                selected={this.state.activeStory === 'report'}
                data-story="report"
                text="Отчет"
              ><Icon28Newsfeed /></TabbarItem>
            </Tabbar>
          }
        >
          <Club id="club" isAdmin={this.state.isAdmin} visiters={this.state.visiters}></Club>
          <Visiters id="visiters" visiters={this.state.visiters}></Visiters>
          <Report id="report" visiters={this.state.visiters}></Report>
          <View id="lendGames" activePanel={this.state.activePanel}>
            <Home id="home" fetchedUser={this.state.fetchedUser} go={this.go} />
            <Persik id="persik" go={this.go} />
          </View>
        </Epic>
      );
    } else {
      return (
        <Root activeView={this.state.activeStory}>
          <Club
            id="club"
            isAdmin={this.state.isAdmin}
            goToVisiters={() => this.setState({ activeStory: "visiters" })}
          ></Club>
          <Visiters
            id="visiters"
            goToClub={() => this.setState({ activeStory: "club" })}
          ></Visiters>
        </Root>
      );
    }
  }
}

export default App;
