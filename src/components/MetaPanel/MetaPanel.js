import React, { Component } from "react";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  List,
  Image,
} from "semantic-ui-react";
import { connect } from "react-redux";
export class MetaPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
    };
    this.setActiveIndex = this.setActiveIndex.bind(this);
  }

  setActiveIndex(e, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState(
      {
        activeIndex: newIndex,
      },
      () => console.log(this.state.activeIndex)
    );
  }

  displayTopPosters(users) {
    const Newarray = Object.entries(users).sort((a, b) =>
      a[1].count > b[1].count ? -1 : 1
    );
    return Newarray.map(([name, val]) => (
      <List.Item key={val.avatar}>
        <Image src={val.avatar} />
        <List.Content>
          <List.Header as="a">{name}</List.Header>
          <List.Description>{val.count}post(s)</List.Description>
        </List.Content>
      </List.Item>
    ));

  }

  render() {
    const { activeIndex } = this.state;
    return (
      <Segment>
        <Header as="h3" attached="top">
          About #{this.props.channel.currentChannel ? this.props.channel.currentChannel.name : null}
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {this.props.channel.currentChannel ? this.props.channel.currentChannel.details : null}
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List>
              {this.props.topPosts
                ? this.displayTopPosters(this.props.topPosts)
                : null}
            </List>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            {this.props.channel.currentChannel ? (this.props.channel.isPrivateChannel ? null : this.props.channel.currentChannel.createdBy.name ) : null}
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}
const mapStateToProps = (state) => ({
  topPosts: state.topPosts.userPosts,
  channel: state.channel,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MetaPanel);
