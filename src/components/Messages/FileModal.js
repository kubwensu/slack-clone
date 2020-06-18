import React, { Component } from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import mime from 'mime-types'

export class FileModal extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             file: null,
             authorized: ['image/jpeg','image/png']
        }
        this.addFile =this.addFile.bind(this)
        this.sendFile =this.sendFile.bind(this)
        this.clearFile =this.clearFile.bind(this)
        this.isAuthorized = this.isAuthorized.bind(this)
        
    }
    
    addFile(e){
        const file = e.target.files[0]
        this.setState({file})
    }

    sendFile(){
        const {uploadFile, closeModal} = this.props;
        const {file} = this.state;
        if(file){
            if(this.isAuthorized(file.name)){
                const metadata = {contentType: mime.lookup(file.name)};
                uploadFile(file, metadata);
                closeModal();
                this.clearFile();
            }
        }
    }
    clearFile(){
        this.setState({file: null})
    }

   

    isAuthorized(filename){
      return  this.state.authorized.includes(mime.lookup(filename))
    }
  render() {
    const { modal, closeModal } = this.props;
    return (
      <Modal basic open={modal} close={closeModal}>
        <Modal.Header>select an image file</Modal.Header>
        <Modal.Content>
          <Input onChange={this.addFile} fluid label="File" name="file" type="file" />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="checkmark" />
            Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
