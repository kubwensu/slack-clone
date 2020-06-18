import React, { Component } from 'react'
import db from '../../db'
import {connect} from 'react-redux';
import {setCurrentChannel, setPrivateChannel} from '../../actions/index' 
import { Menu, Icon} from 'semantic-ui-react'

export class DirectMessages extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             users: [],
             user: props.currentUser,
             activeChannel: '',
             dmListener: null
        }
        this.changeChannel = this.changeChannel.bind(this)
        this.setActiveChannel = this.setActiveChannel.bind(this)
        this.addListeners = this.addListeners.bind(this)
    }

    componentDidMount() {
        if(this.state.user){
            this.addListeners(this.state.user.uid)
        }
    }

    addListeners(uid){
        this.setState({
            dmListener:  db.collection('users').onSnapshot(snap => {
            let loadedUsers = [];
            snap.docChanges().forEach(change => {
                       if(uid !== change.doc.id){
                        let user = change.doc.data()
                        user['uid'] = change.doc.id
                        loadedUsers.push(user);
                    } 
                //     if(change.type == 'added'){
            
                // }
            })
            this.setState({users : loadedUsers})
        })
        })
       
    }

    componentWillUnmount() {
        this.state.dmListener()
    }
    

    changeChannel(user){
        const channelId = user.uid < this.state.user.uid ? `${this.state.user.uid}${user.uid}` : `${user.uid}${this.state.user.uid}`
        console.log(channelId)
        const channelData = {
            id: channelId,
            name: user.displayName
        }

        this.props.setCurrentChannel(channelData)
        this.props.setPrivateChannel(true)
        this.setActiveChannel(user.uid)
    }

    setActiveChannel(userId){
        this.setState({activeChannel: userId})
    }
    
    
    render() {
        const {users} = this.state;
        return (
            <Menu.Menu>
                <Menu.Item>
                    <span>
                        <Icon name="mail"/> DIRECT MESSAGES
                    </span>
                    ({this.state.users.length})
                </Menu.Item>
                {users.map(user => (
                    <Menu.Item
                    active={user.uid == this.state.activeChannel}
                    key={user.uid}
                    onClick={() => {this.changeChannel(user)}}
                    style={{opacity: 0.7, fontStyle: 'italic'}}
                    >
                        <Icon
                        name="circle"
                        color={user.online? 'green' : 'red'}/>
                        @ {user.displayName}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        )
    }
}
const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
   setPrivateChannel,
   setCurrentChannel
}


export default connect(mapStateToProps, mapDispatchToProps)(DirectMessages)

// {users.map(user => (
//     <Menu.Item
//     key={user.uid}
//     onClick={()=> console.log(user)}
//     style={{opacity: 0.7, fontStyle: 'italic'}}
//     >
//     <Icon 
//     name="circle"
//     color={this.state.user.online ? 'green' : 'red'}/>
//     </Menu.Item>
//     )}
