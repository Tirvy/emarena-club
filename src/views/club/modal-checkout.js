import React from "react";
import {
  platform,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  IOS,
  HeaderButton,
  FormLayout,
  FormLayoutGroup,
  Input,
  Radio,
  Checkbox
} from "@vkontakte/vkui";
import Icon24Done from "@vkontakte/icons/dist/24/done";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";

const osname = platform();

export default class Club extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeModal: null
    }
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (!prevProps.visit && this.props.visit) {

      const date_end = new Date();
      const date_start = new Date(this.props.visit.data().start.seconds * 1000);

      this.setState({
        date_start,
        date_end,
        type: "other",
        bonus_card: false,
        bonus_student: false,
        sum: 0,
        activeModal: 'checkout'
      });

      this.updateBonus(
        {
          bonus_card: false,
          bonus_student: false,
        }
      );
    } else if (prevProps.visit && !this.props.visit) {
      this.setState({ activeModal: null });
    }
  };

  setDefaults = () => {
    this.setState({
      type: "other",
      bonus_card: false,
      bonus_student: false,
      sum: 0,
    });
  };

  cancel = () => {
    this.setDefaults();
    this.props.cancel();
  };

  save = () => {
    this.props.save({
      id: this.props.visit.id,
      end: this.state.date_end,
      check_sum: this.state.sum,
      check_type: this.state.type
    });
    this.cancel();
    this.setDefaults();
  };

  updateBonus = (new_state) => {
    if (new_state) {
      this.setState(new_state);
    }

    const STOPCHECK = 590;
    const STOPCHECK_CARD = 550;
    const STOPCHECK_STUDENT = 390;

    const bonus_source = (new_state && (new_state.bonus_card !== undefined)) ? new_state.bonus_card : this.state.bonus_card;
    const student_source = (new_state && (new_state.bonus_student !== undefined)) ? new_state.bonus_student : this.state.bonus_student;

    let limit = STOPCHECK;
    if (bonus_source) {
      limit = STOPCHECK_CARD;
    }
    if (student_source) {
      limit = STOPCHECK_STUDENT;
    }

    const date_end = new Date();
    const date_start = new Date(this.props.visit.data().start.seconds * 1000);

    let difference =
      (date_end.getTime() - date_start.getTime()) / 1000 / 60 / 60;

    const COST_BASIC = [
      { hours: 1, sum: 150 },
      { hours: 2, sum: 300 },
      { hours: 3, sum: 450 },
    ];
    const COST_CARD = [
      { hours: 2, sum: 150 },
      { hours: 4, sum: 300 },
      { hours: 6, sum: 450 },
    ];

    const cost_array = bonus_source ? COST_CARD : COST_BASIC;
    const addition = 0.25;
    const cost_value = cost_array.find(item => item.hours > difference + addition);
    let sum = cost_value ? cost_value.sum : limit;

    if (!sum || sum > limit) {
      sum = limit;
    }

    this.setState({ sum: sum });
  }


  setType = (type) => {
    this.setState({ type: type });
  }

  render() {
    return (
      <ModalRoot activeModal={this.state.activeModal}>
        <ModalPage
          id='checkout'
          onClose={this.cancel}
          header={
            <ModalPageHeader
              left={
                osname !== IOS && (
                  <HeaderButton onClick={this.props.cancel}>
                    <Icon24Cancel />
                  </HeaderButton>
                )
              }
              right={
                <HeaderButton onClick={this.save}>
                  {osname === IOS ? "Готово" : <Icon24Done />}
                </HeaderButton>
              }
            >
              Оформление
            </ModalPageHeader>
          }
        >
          <FormLayout>
            <FormLayoutGroup top="Бонусы">
              <Checkbox
                value={this.state.bonus_card}
                onChange={e => this.updateBonus({ bonus_card: !this.state.bonus_card })}
              >
                Бонусная карта
              </Checkbox>
              <Checkbox
                value={this.state.bonus_student}
                onChange={e => this.updateBonus({ bonus_student: !this.state.bonus_student })}
              >
                Студак
              </Checkbox>
            </FormLayoutGroup>
            <FormLayoutGroup top="Сумма">
              <Input
                value={this.state.sum}
                type="number"
                onChange={e => this.setState({ sum: e.target.value })}
              />
            </FormLayoutGroup>

            <FormLayoutGroup top="Способ оплаты">
              <Radio name="payment" value={"cash"} onInput={() => this.setType('cash')}>
                Наличка
              </Radio>
              <Radio name="payment" value={"card"} onInput={() => this.setType('card')}>
                Карта
              </Radio>
              <Radio name="payment" value={"other"} onInput={() => this.setType('other')}>
                Другой
              </Radio>
            </FormLayoutGroup>
          </FormLayout>
        </ModalPage>
      </ModalRoot>
    );
  }
}
