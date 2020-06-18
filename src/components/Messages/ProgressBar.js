import React, { Component } from "react";
import { Progress } from "semantic-ui-react";

export class ProgressBar extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.uploadState==='uploading' ? (
          <Progress
            className="progress__bar"
            percent={this.props.percentUploaded}
            progress
            indicating
            inverted
            size="medium"
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default ProgressBar;
