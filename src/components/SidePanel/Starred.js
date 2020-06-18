import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import { Menu, Icon } from "semantic-ui-react";
import db from "../../db";

export class Starred extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.currentUser,
      activeChannel: "",
      starredChannels: [],
    };
    this.changeChannel = this.changeChannel.bind(this);
    this.setActiveChannel = this.setActiveChannel.bind(this);
  }

  componentDidMount() {
    if (this.state.user) {
      db.collection("users")
        .doc(this.state.user.uid)
        .collection("starred")
        .onSnapshot((snap) => {
          var favs = [];
          var deleted = [];
          snap.docChanges().forEach((change) => {
            if (change.type == "added") {
              favs.push({  
                id: change.doc.id,
                name: change.doc.data().name,
                details: change.doc.data().details,
                createdBy: {
                  name: change.doc.data().createdBy.name,
                  avatar: change.doc.data().createdBy.avatar,
                }
                });
            } else if (change.type == "removed") {
              deleted = this.state.starredChannels.filter(channel => channel.id !== change.doc.id );
              console.log(this.state.starredChannels, 'starred one')
              console.log(deleted)
            }
          });
          if(favs.length > 0){
            this.setState({
              starredChannels: [...this.state.starredChannels, ...favs]
            })
          }else{
            this.setState({
              starredChannels: deleted
            })
          }
        });
    }
  }

  changeChannel(channel) {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  }

  setActiveChannel(channel) {
    this.setState({ activeChannel: channel.id });
  }

  render() {
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star" />
            STARRED
          </span>
          ({this.state.starredChannels.length})
        </Menu.Item>
        {this.state.starredChannels
          ? this.state.starredChannels.map((channel) => (
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
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setCurrentChannel,
  setPrivateChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Starred);
