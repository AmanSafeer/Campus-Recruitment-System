import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

class CustomizedDialogDemo extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    { this.props.requestedData && this.props.requestedData() }
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  update = () => {
    this.setState({ open: false });
    this.props.action()
  };

  render() {
    return (
      <div>
        {this.props.update ?
          <div>
            <Button style={{ width: "max-content" }} variant="outlined" color="secondary" onClick={this.handleClickOpen}>
              {this.props.name}
            </Button>
            {this.props.updation ?
              <div>
                <Dialog
                  onClose={this.handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={this.state.open}
                >
                  <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                    <div title={"Profile"} style={{ minWidth: "50%", maxWidth: "80%", overflow: "hidden", textOverflow: "ellipsis" }}>Profile</div>
                  </DialogTitle>
                  <DialogContent>
                    <Typography gutterBottom><b>Name:</b> {this.props.updation.name}</Typography>
                    <Typography gutterBottom><b>Gender:</b> {this.props.updation.gender}</Typography>
                    <Typography gutterBottom><b>Qualification:</b> {this.props.updation.qualification}</Typography>
                    <Typography gutterBottom><b>Percentage:</b> {this.props.updation.percentage}%</Typography>
                    <Typography gutterBottom><b>Skill:</b> {this.props.updation.skill}</Typography>
                    <Typography gutterBottom><b>Description:</b> {this.props.updation.description}</Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                      Close
                </Button>
                    <Button onClick={this.update} color="secondary">
                      Update
                </Button>
                  </DialogActions>
                </Dialog>
              </div> : <div></div>}
          </div> :
          <div>
            <Button style={{ width: "max-content" }} variant="outlined" color="primary" onClick={this.handleClickOpen}>
              {this.props.name}
            </Button>
            <Dialog
              onClose={this.handleClose}
              aria-labelledby="customized-dialog-title"
              open={this.state.open}
            >
              <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                <div title={this.props.title} style={{ minWidth: "50%", maxWidth: "80%", overflow: "hidden", textOverflow: "ellipsis" }}>{this.props.title}</div>
              </DialogTitle>
              {this.props.type === "student" ?
                <DialogContent>
                  <Typography gutterBottom><b>Email:</b> {this.props.email}</Typography>
                  <Typography gutterBottom><b>Gender:</b> {this.props.gender}</Typography>
                  <Typography gutterBottom><b>Skill:</b> {this.props.skill}</Typography>
                  <Typography gutterBottom><b>Qualification:</b> {this.props.qualification}</Typography>
                  <Typography gutterBottom><b>Percentage:</b> {this.props.percentage}</Typography>
                  <Typography gutterBottom><b>Description:</b> {this.props.details}</Typography>
                  
                </DialogContent>
                :
                <DialogContent>
                  <Typography gutterBottom><b>Email:</b> {this.props.email}</Typography>
                  <Typography gutterBottom><b>Job:</b> {this.props.job}</Typography>
                  <Typography gutterBottom><b>Qualification Required:</b> {this.props.qualificationReq}</Typography>
                  <Typography gutterBottom><b>Salary:</b> {this.props.salary}</Typography>
                  <Typography gutterBottom><b>Details:</b> {this.props.details}</Typography>
                </DialogContent>}
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Close
              </Button>
              </DialogActions>
            </Dialog>
          </div>}
      </div>
    );
  }
}

export default CustomizedDialogDemo;