import React, { Component } from "react";
import firebase from "firebase";
import db from "../../db";
import md5 from "md5";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      error: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formValidation = this.formValidation.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (this.state.password !== this.state.passwordConfirmation) {
      this.setState({ error: "enter matching passwords before submit" });
    } else {
      try {
        let user = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );
        await user.user.updateProfile({
          displayName: this.state.username,
          photoURL: `http://gravatar.com/avatar${md5(
            user.user.email
          )}?d=identicon`,
        });

        await firebase.firestore().collection("users").doc(user.user.uid).set({
          displayName: user.user.displayName,
          avatar: user.user.photoURL,
        });
      } catch (error) {
        this.setState({error: error.message})
      }
    }
  }

  formValidation(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.password !== this.state.passwordConfirmation) {
        this.setState({ error: "enter matching passwords" });
      } else {
        this.setState({ error: null });
      }
    });
  }

  render() {
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register For Devchat
          </Header>

          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={(e) => {
                  this.formValidation(e);
                }}
                type="text"
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={(e) => {
                  this.formValidation(e);
                }}
                type="email"
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={(e) => {
                  this.formValidation(e);
                }}
                type="password"
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={(e) => {
                  this.formValidation(e);
                }}
                type="password"
              />

              <Button color="orange" fluid size="large">
                Submit
              </Button>
              {this.state.error ? (
                <Message color="red">{this.state.error}</Message>
              ) : null}
            </Segment>
          </Form>
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
