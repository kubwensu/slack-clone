import React, { Component } from "react";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from "semantic-ui-react";
import firebase from "firebase";
import AvatarEditor from "react-avatar-editor";
import { connect } from "react-redux";
import db from "../../db";

export class UserPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.currentUser,
      modal: false,
      previewImage: "",
      blob: "",
      storageRef: firebase.storage().ref(),
      croppedImage: "",
      userRef: firebase.auth().currentUser,
      usersRef: db.collection("users"),
      metadata: {
        contentType: "image/jpeg",
      },
      uploadedCroppedImage: "",
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCropImage = this.handleCropImage.bind(this);
    this.uploadCroppedImage = this.uploadCroppedImage.bind(this);
    this.changeAvatar = this.changeAvatar.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
  }

  handleChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({
          previewImage: reader.result,
        });
      });
    }
  }

  openModal() {
    this.setState({
      modal: true,
    });
  }

  closeModal() {
    this.setState({
      modal: false,
    });
  }

  uploadCroppedImage() {
    const { storageRef, user, blob, metadata } = this.state;

    storageRef
      .child(`avatars/user-${user.uid}`)
      .put(blob, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then((downloadURL) => {
          this.setState(
            {
              uploadedCroppedImage: downloadURL,
            },
            () => this.changeAvatar()
          );
        });
      });
  }

  changeAvatar() {
    this.state.user
      .updateProfile({
        photoURL: this.state.uploadedCroppedImage,
      })
      .then(() => {
        console.log("photoURL updated");
        this.closeModal();
      })
      .catch((err) => {
        console.log(err.message);
      });

    this.state.usersRef
      .doc(this.state.user.uid)
      .update({
        avatar: this.state.uploadedCroppedImage,
      })
      .then(() => {
        console.log("photo updated");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  handleCropImage() {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
        let imageURL = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageURL,
          blob,
        });
      });
    }
  }

  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed In as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span onClick={this.openModal}>Change Avatar</span>,
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}>Sign Out</span>,
    },
  ];

  handleSignout() {
    db.collection("users")
      .doc(this.state.user.uid)
      .update({
        online: false,
      })
      .then(() => {
        console.log("successful online toggle to false");
    return firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("signed out");
    });
      });

  
  }
  render() {
    return (
      <Grid style={{ background: this.props.primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            <Header inverted float="left" as="h2">
              <Icon name="code">
                <Header.Content>Slack</Header.Content>
              </Icon>
            </Header>
            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image
                      src={this.state.user.photoURL}
                      spaced="right"
                      avatar
                    />
                    {this.state.user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
          <Modal basic open={this.state.modal} onClose={this.closeModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input
                onChange={this.handleChange}
                fluid
                type="file"
                name="previewImage"
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {this.state.previewImage && (
                      <AvatarEditor
                        ref={(node) => {
                          this.avatarEditor = node;
                        }}
                        image={this.state.previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {this.state.croppedImage && (
                      <Image
                        style={{ margin: "3.5em auto" }}
                        width={100}
                        height={100}
                        src={this.state.croppedImage}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {this.state.croppedImage && (
                <Button
                  color="green"
                  inverted
                  onClick={this.uploadCroppedImage}
                >
                  <Icon name="save" />
                  Change Avatar
                </Button>
              )}
              <Button color="green" inverted onClick={this.handleCropImage}>
                <Icon name="image" />
                Preview
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" />
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default UserPanel;
