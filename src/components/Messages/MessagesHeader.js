import React, { Component } from "react";
import { Header, Segment, Icon, Input} from "semantic-ui-react";

export class MessagesHeader extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       channel: props.channel,
    }
  }
  
  render() {
     const includes = this.state.channel ? this.props.starredChats.includes(this.state.channel.id) : null ;
     const channel = this.state.channel;

    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {this.props.channel ? `${this.props.isPrivateChannel ? '@' : '#'}${this.props.channel.name}` : null}
             <Icon 
            onClick={this.props.handleStar}
            name={  includes ? "star" : "star outline"} 
            color={includes ?"yellow" : "black"} /> 
          </span>
          <Header.Subheader>{this.props.uniqueUsers}</Header.Subheader>
        </Header>

        {/* Channel Search Input */}
        <Header floated="right">
          <Input
          onChange={this.props.handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
