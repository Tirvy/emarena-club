import React from "react";
import {
  Panel,
  PanelHeader,
  Button,
  HeaderButton,
  FormLayout,
  Input,
  Textarea,
  Group,
  platform,
  IOS
} from "@vkontakte/vkui";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import Icon16Add from "@vkontakte/icons/dist/16/add";
import { db } from "../firebase";

const osname = platform();

export default class Visiters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.visiter.id,
      name: props.visiter.name,
      description: props.visiter.description
    };
  }

  save = () => {
    db.collection("visiters")
      .doc(this.state.id)
      .set(
        {
          name: this.state.name,
          description: this.state.description
        },
        { merge: true }
      )
      .then(() => {
        this.props.goBack();
      });
  };

  archive = () => {
    this.props.archive();
  };

  render() {
    return (
      <Panel id={this.props.id}>
        <PanelHeader
          left={
            <HeaderButton onClick={this.props.goBack} data-to="back">
              {osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
            </HeaderButton>
          }
        >
          Профиль
        </PanelHeader>
        <Group>
          <FormLayout>
            <Input
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
              top="Никнейм"
              placeholder="Никнейм"
            />
            <Textarea
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
              top="Короткое описание"
              placeholder="Подпись, чтобы точно определять человека"
            />
            <Button size="xl" onClick={this.save}>
              Сохранить
            </Button>
            <Button before={<Icon16Add />} onClick={this.archive}>
              Удалить
            </Button>
          </FormLayout>
        </Group>
      </Panel>
    );
  }
}
