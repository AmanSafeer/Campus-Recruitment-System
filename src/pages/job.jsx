import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Header from '../components/header'
import blue from '@material-ui/core/colors/blue';
import * as firebase from 'firebase'
import { signInUser, postJob } from '../store/action/action'

const styles = (theme) => ({
  inputField: {
    width: "80%",
  },
  cssLabel: {
    '&$cssFocused': {
      color: blue[800],
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: blue[800],
    },
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: blue[800],
    },
  },
  notchedOutline: {},
});


class Job extends Component {
  constructor(props) {
    super(props)
    this.state = {
      job: '',
      qualificationReq: '',
      salary: '',
      jobDetails: ''
    }
  }
  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      error: ''
    });
  }
  postJob = (event) => {
    event.preventDefault()
    const { job, qualificationReq, salary, jobDetails } = this.state;
    const obj = { job, qualificationReq, salary, jobDetails }
    this.props.postJob(obj, this.props.userId)
    this.setState({
      job: '',
      qualificationReq: '',
      salary: '',
      jobDetails: ''
    })
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.signInUser(user, this.props.history);
      }
    })
  }
  render() {
    const { classes } = this.props
    return (
      (this.props.profile && this.props.profile.userType === "company") &&
      <div>
        <Header history={this.props.history} value={0} />
        <h1>Post Job</h1>
        {this.props.profile.available ?
          <div>
            <form onSubmit={this.postJob}>
              <FormControl required className={classes.inputField}>
                <InputLabel classes={{ root: classes.cssLabel, focused: classes.cssFocused, }}>Job</InputLabel>
                <Select input={<Input classes={{ underline: classes.cssUnderline, }} />} style={{ textAlign: 'left' }} value={this.state.job} onChange={this.changeHandler} inputProps={{ name: 'job' }}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Software Engenieer">Software Engineer</MenuItem>
                  <MenuItem value="Web developer">Web developer</MenuItem>
                  <MenuItem value="Mobile App Developer">Mobile App Developer</MenuItem>
                  <MenuItem value="Graphic Designer">Graphic Designer</MenuItem>
                </Select>
              </FormControl><br />

              <FormControl required className={classes.inputField}>
                <InputLabel classes={{ root: classes.cssLabel, focused: classes.cssFocused, }}>Qualification Required</InputLabel>
                <Select input={<Input classes={{ underline: classes.cssUnderline, }} />} style={{ textAlign: 'left' }} value={this.state.qualificationReq} onChange={this.changeHandler} inputProps={{ name: 'qualificationReq' }}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Matriculation">Matriculation</MenuItem>
                  <MenuItem value="Intermidiate">Intermediate</MenuItem>
                  <MenuItem value="Gradutaion">Gradutaion</MenuItem>
                  <MenuItem value="Master">Master</MenuItem>
                  <MenuItem value="Master">Phd</MenuItem>
                </Select>
              </FormControl><br />

              <TextField className={classes.inputField} label="Salary" margin="normal" type="text" name="salary" value={this.state.salary} onChange={this.changeHandler} inputProps={{ maxLength:30 }} required /><br />
              <TextField className={classes.inputField} label="Job Details" margin="normal" type="text" name="jobDetails" value={this.state.jobDetails} onChange={this.changeHandler} multiline rowsMax="10" required /><br />
              <Button variant="contained" color="primary" type="submit" value="submit">Post</Button>
            </form>
          </div> :
          <p>Sorry, you have been blocked by the admin</p>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.root.profile,
    userId: state.root.userId
  }
}
function mapDispatchToProps(dispatch) {
  return {
    postJob: (obj, uid) => dispatch(postJob(obj, uid)),
    signInUser: (user, history) => dispatch(signInUser(user, history))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Job));