import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import App from "./components/App";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import firebase from 'firebase';
import { connect } from 'react-redux'
import {setUser, clearUser} from './actions/index'
import Spinnner from './Spinner'
import db from './db'

export class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
        if(user){
          db.collection('users').doc(user.uid).update({
            online: true
          }).then(()=>{
            console.log('logged in')
            this.props.setUser(user);
            this.props.history.push('/');
          })
        }else{
            this.props.history.push('/login');
            this.props.clearUser();
        }
    })
}
 
  render() {
    return this.props.isLoading ? <Spinnner/> : (
        <div>
          <Switch>
            <Route path="/" component={App} exact/>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.user.isLoading,
  user: state.user.currentUser
})

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
    clearUser: () => dispatch(clearUser())
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Root))

