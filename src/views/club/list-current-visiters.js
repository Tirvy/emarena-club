import React from "react";
import { List, Cell, Div } from "@vkontakte/vkui";
import Icon24LogoLivejournal from "@vkontakte/icons/dist/24/logo_livejournal";
import Icon24ReplyOutline from "@vkontakte/icons/dist/24/reply_outline";
import Icon24UserOutgoing from "@vkontakte/icons/dist/24/user_outgoing";

export default function (props) {
  const currentVisits = props.visits
    .filter(visit => !visit.data().end)
    .sort((a, b) => a.data().start.seconds - b.data().start.seconds);
  if (currentVisits.length) {
    return (
      <List>
        {currentVisits
          .sort((a, b) => {
            return a.data().start.seconds - b.data().start.seconds;
          })
          .map(visit => {
            const visiter_id = visit.data().visiter_id;
            const visiter = props.visiters.find(visiter => {
              return visiter.id === visiter_id;
            });
            const visiter_data = visiter
              ? visiter
              : { name: "undefined" };

            const mseconds_spend =
              new Date().getTime() - visit.data().start.seconds * 1000;
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

            const formatted_start = `${("0" + date_start.getHours()).slice(
              -2
            )}:${("0" + date_start.getMinutes()).slice(-2)}`;

            return (
              <Cell
                key={visit.id}
                before={
                  <Icon24LogoLivejournal
                    onClick={() => props.editVisiter(visiter_id)}
                  />
                }
                asideContent={
                  <Icon24UserOutgoing
                    onClick={() => props.removeVisit(visit.id)}
                  />
                }
                description={
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        overflow: "auto",
                        textOverflow: "ellipsis",
                        paddingRight: "10px"
                      }}
                    >
                      {visiter_data.description || "-"}
                    </div>
                    <div>{formatted_start}</div>
                  </div>
                }
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>{visiter_data.name}</div>
                  <div>{diff}</div>
                </div>
              </Cell>
            );
          })}
      </List>
    );
  } else {
    return <Div>Посетителей нет, но вы держитесь</Div>;
  }
}
