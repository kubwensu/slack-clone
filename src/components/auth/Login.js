import React, { Component } from 'react'
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
  import firebase from 'firebase';


export class Login extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          email: "",
          password: "",
          error: null,
        };

        this.handleSubmit = this.handleSubmit.bind(this)
      }

      async handleSubmit(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(()=> {
            console.log('login successful');
        }).catch(err => {
            this.setState({error: err.message})
        })
    
      }


      formValidation(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
    render() {
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h1" icon color="violet" textAlign="center">
                <Icon name="code branch" color="violet" />
                Login to Devchat
              </Header>
    
              <Form size="large" onSubmit={this.handleSubmit}>
                <Segment stacked>
            
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
     
    
                  <Button color="violet" fluid size="large">
                    Submit
                  </Button>
                  {this.state.error ? (
                    <Message color="red">{this.state.error}</Message>
                  ) : null}
                </Segment>
              </Form>
              <Message>
                Don't have an account? <Link to="/register">Register</Link>
              </Message>
            </Grid.Column>
          </Grid>
        )
    }
}

export default Login
