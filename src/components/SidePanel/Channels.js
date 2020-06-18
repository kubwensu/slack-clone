import React, { Component } from "react";
import { Menu, Icon, Modal, Form, Button, Input } from "semantic-ui-react";
import db from "../../db";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions/index";
export class Channels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeChannel: "",
      user: props.currentUser,
      channel: null,
      messagesRef: db.collection("messages"),
      notifications: [],
      channels: null,
      modal: false,
      channelName: "",
      channelDetails: "",
      loadedChannels: null,
      firstLoad: true,
      listeners: null,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.addChannel = this.addChannel.bind(this);
    // this.addNotificationListener = this.addNotificationListener.bind(this);
    // this.handleNotifications = this.handleNotifications.bind(this);
  }

  openModal() {
    this.setState({ modal: true });
  }

  closeModal() {
    this.setState({ modal: false });
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  changeChannel(channel) {
    db.collection('channels').doc(this.state.activeChannel).collection('typing').doc(this.state.user.uid).delete() 
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({channel})
  }

  setActiveChannel(channel) {
    this.setState({ activeChannel: channel.id });
  }

  removeListeners() {
    this.state.listeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  componentDidMount() {
    this.setState({
      listeners: db.collection("channels").onSnapshot((snapData) => {
        const channels = [];
        snapData.forEach((doc) => {
          channels.push(doc.data());
        });
        this.setState(
          {
            channels,
          },
          () => this.setFirstChannel()
        );
      }),
    });
  }

  // addNotificationListener(channelId){
  //     this.state.messagesRef.doc(channelId).onSnapshot(snap => {
  //       if(this.state.channel){
  //         this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap)
  //       }
  //     })
  // } 

  // handleNotifications(channelId, currentChannelId, notifications, snap){
  //   let lastTotal = 0;
  //   let index = this.state.notifications.findIndex(notification => notification.id == channelId);

  //   if(index !== -1){
  //     if(channelId == currentChannelId ){
  //      this.state.lastTotal = notifications[index].data

  //       if(snap.length - lastTotal > 0){
  //       notifications[index].count = snap.length -this.state.lastTotal 
  //       }
  //     }

  //     notifications[index].lastKnownTotal = snap.length
  //   }else{
  //     notifications.push({
  //       id: channelId,
  //       total: snap.length,
  //       lastKnownTotal: snap.length,
  //       count: 0
  //     })

  //   }

  //   this.setState({notifications})

  // }

  
  setFirstChannel() {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  }

  addChannel() {
    let docRef = db.collection("channels").doc();
    const newChannel = {
      id: docRef.id,
      name: this.state.channelName,
      details: this.state.channelDetails,
      createdBy: {
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    };
    docRef
      .set(newChannel)
      .then(() => {
        this.setState({
          channelDetails: "",
          channelName: "",
        });
        this.closeModal();
        console.log("success");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    } else {
      console.log("nothing");
    }
  }

  isFormValid({ channelName, channelDetails }) {
    return channelName && channelDetails;
  }

  render() {
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>
            ({this.state.channels ? this.state.channels.length : 0})
            <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.state.channels
            ? this.state.channels.map((channel) => (
                <Menu.Item
                  key={channel.id}
                  onClick={() => {
                    this.changeChannel(channel);
                  }}
                  name={channel.name}
                  style={{ opacity: 0.7 }}
                  active={channel.id == this.state.activeChannel}
                >
                  #{channel.name}
                </Menu.Item>
              ))
            : null}
        </Menu.Menu>
        <Modal basic open={this.state.modal} onClose={this.closeModal}>
          <Modal.Header>Add a channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" />
              Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({});

//convenience sake
// const mapDispatchToProps = {
//     setCurrentChannel
// }

const mapDispatchToProps = {
  setCurrentChannel,
  setPrivateChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
