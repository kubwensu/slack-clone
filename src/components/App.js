import React, { Component } from "react";
import "./App.css";
import { Grid } from "semantic-ui-react";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import ColorPanel from "./ColorPanel/ColorPanel";
import { connect } from "react-redux";
class App extends Component {
  render() {
    return (
      <Grid columns="equal" className="app" style={{ background: this.props.secondaryColor }}>
        <ColorPanel currentUser={this.props.currentUser}/>
        <SidePanel
          key={this.props.currentUser && this.props.currentUser.uid}
          currentUser={this.props.currentUser}
          primaryColor={ this.props.primaryColor }
        />
        <Grid.Column style={{ marginLeft: 320 }}>
          <Messages
            key={this.props.currentChannel && this.props.currentChannel.id}
            currentChannel={this.props.currentChannel}
            currentUser={this.props.currentUser}
            isPrivateChannel ={this.props.isPrivateChannel}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <MetaPanel />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  primaryColor: state.colors?  state.colors.colors[0] : null ,
  secondaryColor: state.colors? state.colors.colors[1] : null,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
