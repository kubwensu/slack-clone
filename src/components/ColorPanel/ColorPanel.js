import React, { Component } from "react";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment,
} from "semantic-ui-react";
import { SliderPicker } from "react-color";
import db from "../../db";
import { connect } from "react-redux";
import { setColors } from "../../actions/index";

export class ColorPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      primaryColor: "",
      SecondaryColor: "",
      userColors: [],
      listeners: null,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSaveColors = this.handleSaveColors.bind(this);
  }

  componentDidMount() {
    if (this.props.currentUser) {
      this.setState({
        listeners: db
          .collection("users")
          .doc(this.props.currentUser.uid)
          .onSnapshot((snap) => {
            this.setState({
              userColors: snap.data().colors,
            });
          }),
      });
    }
  }

  componentWillUnmount() {
    this.setState({
      listeners: this.state.listeners()
    })
  }

  openModal() {
    this.setState((prevState) => {
      return { modal: !prevState.modal };
    });
  }

  closeModal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  handleSaveColors() {
    const colors = [this.state.primaryColor, this.state.secondaryColor];
    this.closeModal();

    this.setState({
      primaryColor: "",
      secondaryColor: "",
    });

    db.collection("users")
      .doc(this.props.currentUser.uid)
      .update({
        colors: colors,
      })
      .then(() => {
        console.log("updated colors");
      })
      .catch((err) => console.log(err.message));
  }

  displayUserColors(colors) {
    const colorSquares = colors
      ? colors.map((color, i) => (
          <React.Fragment key={color}>
            <Divider />
            <div
              className="color__container"
              onClick={() => this.props.setColors([colors[0], colors[1]])}
            >
              <div className="color__square" style={{ background: colors[0] }}>
                <div
                  className="color__overlay"
                  style={{ background: colors[1] }}
                ></div>
              </div>
            </div>
          </React.Fragment>
        ))
      : null;
    return colorSquares ? colorSquares[0] : null;
  }

  render() {
    return (
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        width="very thin"
      >
        <Divider />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />
        {this.displayUserColors(this.state.userColors)}

        <Modal basic open={this.state.modal} onClose={this.closeModal}>
          <Modal.Header>Choose App Color</Modal.Header>
          <Modal.Content>
            <Segment inverted>
              <Label content="Primary Color" />
              <SliderPicker
                color={this.state.primaryColor}
                onChange={(color) => {
                  this.setState({
                    primaryColor: color.hex,
                  });
                }}
              />
            </Segment>
            <Segment inverted>
              <Label content="Secondary Color" />
              <SliderPicker
                color={this.state.secondaryColor}
                onChange={(color) => {
                  this.setState({
                    secondaryColor: color.hex,
                  });
                }}
              />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSaveColors}>
              <Icon name="checkmark" />
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" />
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setColors,
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorPanel);
