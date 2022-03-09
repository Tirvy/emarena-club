import React from "react";
import {
  Panel,
  PanelHeader,
  Group,
  View,
  FormLayout,
  FormLayoutGroup,
  Input,
  Cell,
  Button
} from "@vkontakte/vkui";
import { db } from "../../firebase";

class Report extends React.Component {
  constructor(props) {
    super(props);

    const date = new Date();

    console.log(props);

    this.state = {
      visits: [],
      day: "" + date.getDate(),
      month: "" + (date.getMonth() + 1),
      year: "" + date.getFullYear()
    };
  }

  getReport = () => {
    const the_day = new Date(
      +this.state.year,
      +this.state.month - 1,
      +this.state.day
    );
    const the_next_day = new Date(
      +this.state.year,
      +this.state.month - 1,
      +this.state.day + 1
    );
    db.collection("visits")
      .where("start", ">=", the_day)
      .where("start", "<=", the_next_day)
      .get()
      .then(res => {
        const visits = res.docs;
        this.setState({ visits: visits });
      });
  };

  getReportList = () => {
    if (this.props.visiters.length && this.state.visits.length) {
      const visits_list = this.state.visits.filter(visit => visit.data().end);
      const report_data = visits_list.reduce((total, item) => {
        const data = item.data();
        total[data.check_type] += isNaN(+data.check_sum) ? 0 : +data.check_sum;
        total.money += +data.check_sum || 0;
        total.people++;
        return total;
      }, { money: 0, card: 0, cash: 0, other: 0, people: 0 })

      return [(
        <Cell
          key={0}
        >
          <div>
            <div>Посещений: {report_data.people}</div>
            <div>Денег: {report_data.money}</div>
            <div>Картой: {report_data.card}</div>
            <div>Наличкой: {report_data.cash}</div>
            <div>Другими: {report_data.other}</div>
          </div>
        </Cell>
      ), visits_list.map(visit => {
        const visit_data = visit.data();
        const visiter_data = this.props.visiters.find(
          visiter => visiter.id === visit_data.visiter_id
        );
        if (!visiter_data) {
          return;
        }

        const mseconds_spend =
          new Date(visit.data().end.seconds * 1000).getTime() -
          visit.data().start.seconds * 1000;
        const date_start = new Date(visit.data().start.seconds * 1000);
        const diff = getDuration(mseconds_spend);

        function getDuration(val) {
          const lm = ~(4 * true); /* limit fraction */
          const fmt = new Date(val).toISOString().slice(11, lm - 3);

          if (val >= 8.64e7) {
            /* >= 24 hours */
            let parts = fmt.split(/:(?=\d{2})/);
            parts[0] -= -24 * ((val / 8.64e7) | 0);
            return parts.join(":");
          }

          return fmt;
        }

        const formatted_start = `${("0" + date_start.getHours()).slice(-2)}:${(
          "0" + date_start.getMinutes()
        ).slice(-2)}`;

        return (
          <Cell
            key={visit.id}
            description={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    overflow: "auto",
                    textOverflow: "ellipsis",
                    paddingRight: "10px"
                  }}
                >
                  {visiter_data.description || "-"}
                </div>
                <div>Пришел: {formatted_start}</div>
              </div>
            }
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{visiter_data.name}</div>
              <div>Провел: {diff}</div>
            </div>
          </Cell>
        );
      })];
    }
  };

  render() {
    return (
      <View activePanel="report">
        <Panel id="report">
          <PanelHeader>Отчет</PanelHeader>
          <Group>
            <FormLayout>
              <FormLayoutGroup top="День/месяц/год">
                <Input
                  value={this.state.day}
                  onChange={e => this.setState({ day: e.target.value })}
                  placeholder="День"
                />
                <Input
                  value={this.state.month}
                  onChange={e => this.setState({ month: e.target.value })}
                  placeholder="Месяц"
                />
                <Input
                  value={this.state.year}
                  onChange={e => this.setState({ year: e.target.value })}
                  placeholder="Год"
                />
                <Button onClick={this.getReport}>Сформировать отчет</Button>
              </FormLayoutGroup>
            </FormLayout>
          </Group>
          <Group>{this.getReportList()}</Group>
        </Panel>
      </View>
    );
  }
}

export default Report;
