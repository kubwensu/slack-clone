import React, { Component } from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

export class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: props.message.timestamp,
    };
  }

  timeFromNow = (timestamp) => moment(timestamp.toDate(), "YYYYMMDD").fromNow();

  isOwnMessage(message, user) {
    return message.user.id == user.uid ? "message__self" : "";
  }

  isImage(message) {
      return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
  }
  render() {
    return (
      <Comment>
        <Comment.Avatar src={this.props.message.user.avatar} />
        <Comment.Content
          className={this.isOwnMessage(this.props.message, this.props.user)}
        >
          <Comment.Author as="a">{this.props.message.user.name}</Comment.Author>
          <Comment.Metadata>
            {this.state.timestamp
              ? this.timeFromNow(this.props.message.timestamp)
              : null}
          </Comment.Metadata>
          {this.isImage(this.props.message) ? (
            <Image src={this.props.message.image} className="message__image" />
          ) : (
            <Comment.Text>{this.props.message.content}</Comment.Text>
          )}
        </Comment.Content>
      </Comment>
    );
  }
}

export default Message;
