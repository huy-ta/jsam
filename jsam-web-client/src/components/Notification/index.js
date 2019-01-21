import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

let openSnackbarFn;

class Notification extends React.Component {
  state = {
    open: false,
    message: ''
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  openSnackbar = message => {
    this.setState({
      open: true,
      message
    });
  };

  handleClose = () => {
    this.setState(() => ({ open: false }));
  };

  render() {
    const { open, message } = this.state;

    if (message) {
      return (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          autoHideDuration={5000}
          open={open && message.length > 0}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{message}</span>}
        />
      );
    }
    return null;
  }
}

export const openSnackbar = message => {
  openSnackbarFn(message);
};

export default Notification;
