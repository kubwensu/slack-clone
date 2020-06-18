import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "firebase";
import db from "../../db";
import FileModal from "./FileModal";
import uuidv4 from "uuid/v4";
import ProgessBar from "./ProgressBar";
import { Picker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

export class MessagesForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageRef: firebase.storage().ref(),
      uploadState: "",
      uploadTask: null,
      percentUploaded: 0,
      message: "",
      loading: false,
      user: props.currentUser,
      error: "",
      modal: false,
      channel: props.currentChannel,
      emojiPicker: false,
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.createMessage = this.createMessage.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.sendFileMessage = this.sendFileMessage.bind(this);
    this.getPath = this.getPath.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePicker = this.handlePicker.bind(this);
    this.handleEmoji = this.handleEmoji.bind(this);
  }

  getPath() {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`;
    } else {
      return `chat/public`;
    }
  }

  uploadFile(file, metadata) {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var percentUploaded =
              (snap.bytesTransferred / snap.totalBytes) * 100;
            this.setState({ percentUploaded });
          },
          (error) => {
            // Handle unsuccessful uploads
            console.log(error.message);
            this.setState({
              error: error.message,
              uploadState: "error",
              uploadTask: null,
            });
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadURL) => {
                this.sendFileMessage(downloadURL, ref, pathToUpload);
              })
              .catch((error) => {
                this.setState({
                  error: error.message,
                  uploadState: "error",
                  uploadTask: null,
                });
              });
          }
        );
      }
    );
  }

  sendFileMessage(fileUrl, ref, pathToUpload) {
    ref
      .doc(pathToUpload)
      .collection("messages")
      .add(this.createMessage(fileUrl))
      .then(() => {
        this.setState({
          uploadState: "done",
        });
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({
          error: err.message,
        });
      });
  }

  handleKeyDown() {
    const { message, user, channel } = this.state;

    if (message) {
      db.collection("channels")
        .doc(channel.id)
        .collection("typing")
        .doc(user.uid)
        .set({
          name: user.displayName,
        });
    } else {
      db.collection("channels")
        .doc(channel.id)
        .collection("typing")
        .doc(user.uid)
        .delete();
    }
  }

  handleEmoji(emoji){
    const oldMessage = this.state.message;
    const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `)
    this.setState({
      message: newMessage,
      emojiPicker: false
    })
    setTimeout(() => 
      this.messageInputRef.focus()
    , 0); 
  }

  colonToUnicode (message)  {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;  
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };


  openModal() {
    this.setState({ modal: true });
  }
  closeModal() {
    this.setState({ modal: false });
  }

  createMessage(fileUrl = null) {
    const message = {
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    };
    if (fileUrl) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  }

  handlePicker() {
    this.setState((PrevState) => {
      return { emojiPicker: !PrevState.emojiPicker };
    });
  }

  sendMessage() {
    const { message, channel, user } = this.state;
    const { currentChannel } = this.props;
    let newMessage = this.createMessage();
    const { getMessagesRef } = this.props;

    if (message) {
      this.setState({ message: "" });
      getMessagesRef()
        .doc(this.props.currentChannel.id)
        .collection("messages")
        .add(newMessage)
        .then(() => {
          this.setState({ loading: false, error: "" });
          db.collection("channels")
            .doc(channel.id)
            .collection("typing")
            .doc(user.uid)
            .delete();
        })
        .catch((error) => {
          this.setState({
            loading: false,
            error: error.message,
          });
        });
    } else {
      this.setState({
        error: "Add a message",
      });
    }
  }

  render() {
    return (
      <Segment className="message__form">
      {this.state.emojiPicker && <Picker
      set="apple"
      className="emojiPicker"
      title="Pick your emoji"
      onSelect={this.handleEmoji}
      emoji="point_up"/>
      }
        {this.state.error ? (
          <p style={{ color: "red" }}>{this.state.error}</p>
        ) : null}
        <Input
          fluid
          name="message"
          id="moji"
          ref ={node =>  (this.messageInputRef =node )}
          // onKeyDown={this.handleKeyDown}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={this.state.emojiPicker ? "close" : "add" } content={this.state.emojiPicker? "Close" : null} onClick={this.handlePicker} />}
          labelPosition="left"
          placeholder="Write your message"
          value={this.state.message}
          onChange={(e) => {
            this.setState({ message: e.target.value }, () =>
              this.handleKeyDown()
            );
          }}
        />
        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
          />
          <Button
            color="teal"
            content="Upload Media"
            disabled={this.state.uploadState === "uploading"}
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
          modal={this.state.modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgessBar
          uploadState={this.state.uploadState}
          percentUploaded={this.state.percentUploaded}
        />
      </Segment>
    );
  }
}

export default MessagesForm;
