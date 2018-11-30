import React from "react";
import Card from "./components/Card";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { NotificationsType } from "./interfaces";

interface Props {
  notifications: NotificationsType[];
}

const Notifications = (props: Props) => {
  if (props.notifications == null) return null;
  const notifications = props.notifications.map(notification => {
    const time =
      notification.time &&
      notification.time.seconds &&
      new Date(notification.time.seconds * 1000);
    return (
      <Card key={notification.id} title="">
        <p className="text-grey-darker text-base">{notification.message}</p>
        <p className="text-grey-dark text-base">{time.toLocaleString()}</p>
      </Card>
    );
  });

  return (
    <div className="container-m flex-col pr-6">
      <h3 className="pb-2">Notifications</h3>
      {notifications}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return { notifications: state.firestore.ordered.notifications };
};

type DispatchFunction = (f: any) => void;

const mapDispatchToProps = (dispatch: DispatchFunction) => {
  return {};
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([{ collection: "notifications" }])
)(Notifications);
