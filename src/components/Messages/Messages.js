import React, { Component } from "react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import { Segment, Comment } from "semantic-ui-react";
import db from "../../db";
import Message from "./Message";
import { connect } from "react-redux";
import { setUserPosts } from "../../actions/index";
import Typing from "./Typing";
import Skeleton from './Skeleton'


export class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privateChannel: props.isPrivateChannel,
      messagesRef: db.collection("messages"),
      privateMessagesRef: db.collection("privateMessages"),
      channel: props.currentChannel,
      user: props.currentUser,
      messages: [],
      messagesListener: null,
      starsListener: null,
      starredChats: [],
      messagesLoading: true,
      modal: false,
      numUniqueUsers: "",
      topPosters: [],
      searchTerm: "",
      searchLoading: false,
      isChannelStarred: false,
      typingUsers: null,
    };
    this.countUniqueUsers = this.countUniqueUsers.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.getMessagesRef = this.getMessagesRef.bind(this);
    this.handleStar = this.handleStar.bind(this);
    this.countPosts = this.countPosts.bind(this);
  }

  getMessagesRef() {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  handleStar() {
    this.starChannel();
  }

  starChannel() {
    if (!this.state.starredChats.includes(this.state.channel.id)) {
      db.collection("users")
        .doc(this.state.user.uid)
        .collection("starred")
        .doc(this.state.channel.id)
        .set({
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar,
          },
        });
    } else {
      db.collection("users")
        .doc(this.state.user.uid)
        .collection("starred")
        .doc(this.state.channel.id)
        .delete()
        .then(() => console.log("success unstarring"))
        .catch((err) => console.log(err.message));
    }
  }

  componentDidMount() {
    const { channel, user } = this.state;
    const ref = this.getMessagesRef();

    if (channel && user) {
      this.setState({
        messagesListener: ref
          .doc(channel.id)
          .collection("messages")
          .onSnapshot((snapData) => {
            let loadedMessages = this.state.messages;
            snapData.docChanges().forEach((change) => {
              if (change.type === "added") {
                loadedMessages.push(change.doc.data());
              }
            });
            this.setState({
              messages: loadedMessages,
              messagesLoading: false,
            });
            this.countUniqueUsers();
            this.countPosts();
          }),
      });
    }

    if (channel) {
      db.collection("channels")
        .doc(channel.id)
        .collection("typing")
        .onSnapshot((snap) => {
          const typers = [];
          snap.docChanges().forEach((change) => {
            if (change.type == "added") {
              if(change.doc.id !== user.uid ){
              typers.push(change.doc);

              }
            } else if (change.type == "removed") {
              const typees = this.state.typingUsers.filter(
                (users) => user.id !== change.doc.id
              );
              this.setState({
                typingUsers: typees,
              });
            }
          });
          this.setState({
            typingUsers: typers,
          });
        });
    }

    this.setState({
      starsListener: db
        .collection("users")
        .doc(this.state.user.uid)
        .collection("starred")
        .onSnapshot((snap) => {
          let starredChats = [];
          snap.forEach((doc) => {
            starredChats.push(doc.id);
          });
          this.setState({
            starredChats,
          });
        }),
    });
  }

  componentWillUnmount() {
    this.state.starsListener ? this.state.starsListener() : null;
    this.state.messagesListener ? this.state.messagesListener() : null;
  }
 
  componentDidUpdate(prevProps, prevState){
      if(this.messagesEnd){
        this.scrollToBottom();
      }
  }


  scrollToBottom(){
    this.messagesEnd.scrollIntoView({behavior: 'smooth'})
  }

  countUniqueUsers() {
    // let counts = {};
    // this.state.messages.forEach(
    //   (message) =>
    //     (counts[message.user.name] = 1 + (counts[message.user.name] || 0))
    // );
    // const uniqueUsers = `${Object.keys(counts).length} user(s)`;

    // this.setState({ numUniqueUsers: uniqueUsers });
    const uniqueUsers = this.state.messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const numUniqueUsers = `${uniqueUsers.length} users`;
    this.setState({
      numUniqueUsers,
    });
  }

  countPosts() {
    const userPosts = this.state.messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1,
        };
      }
      return acc;
    }, {});

    // const sortedPosts = userPosts.sort((a,b) => (a.count > b.count) ?  -1 : 1 )
    // console.log(sortedPosts, "sor'ed")
    this.setState(
      {
        topPosters: userPosts,
      },
      () => this.props.setUserPosts(this.state.topPosters)
    );
  }

  displayMessage(messages) {
    return messages
      ? messages.map((message) => (
          <Message
            key={message.timestamp}
            message={message}
            user={this.state.user}
          />
        ))
      : null;
  }

  handleSearchChange(e) {
    this.setState({
      searchTerm: e.target.value,
      searchLoading: true,
    });
  }

  render() {
    const filteredMessages = this.state.messages.filter((message) => {
      if (this.state.searchTerm) {
        if (message.hasOwnProperty("content")) {
          return message.content.toLowerCase().match(this.state.searchTerm);
        }
      } else {
        return message;
      }
    });
    const { messages } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
          handleSearchChange={this.handleSearchChange}
          channel={this.state.channel}
          uniqueUsers={this.state.numUniqueUsers}
          isPrivateChannel={this.state.privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={this.state.isChannelStarred}
          starredChats={this.state.starredChats}
        />

        <Segment>
          <Comment.Group className="messages">
          {this.state.messagesLoading? (
            <React.Fragment>
            {[...Array(10)].map((_,i) =>(
              <Skeleton key={i}/>
            ))}
          </React.Fragment>
          ) : null
          }
            {this.displayMessage(filteredMessages)}
            {this.state.typingUsers &&
              this.state.typingUsers.map((doc) => (
                <div
                  key={doc.id}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <span className="user__typing">
                    {doc.data().name} is typing
                  </span>{" "}
                  <Typing />
                </div>
              ))}
              <div ref={node => this.messagesEnd = node }></div>
          </Comment.Group>
        </Segment>

        <MessagesForm
          currentChannel={this.props.currentChannel}
          currentUser={this.props.currentUser}
          isPrivateChannel={this.state.privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setUserPosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
