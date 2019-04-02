import React, { Component } from 'react';
import * as firebase from 'firebase'
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import blue from '@material-ui/core/colors/blue';
import Header from '../components/header'
import { signUpUser, signInUser, signInLoaderOpen, signInLoaderClose } from '../store/action/action'
import './styles.css'
import Loader from '../components/Loader'

const styles = (theme) => ({
  inputField: {
    width: "90%",
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


class Sign extends Component {
  constructor(props) {
    super(props)
    this.ref = firebase.database().ref('/');
    this.state = {
      name: '',
      email: 'admin@gmail.com',
      password: 'admin123',
      userType: 'student',
      available: true,
      request: false,

      qualification: '',
      percentage: '',
      skill: '',
      description: '',
      gender: 'male',

      error: '',
      signIn: true
    }
  }
  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      error: ''
    });
  }

  changeForm = () => {
    if (this.state.signIn) {
      this.setState({
        signIn: false,
        email: '',
        password: '',
        error: ''
      });
    }
    else {
      this.setState({
        signIn: true,
        email: 'admin@gmail.com',
        password: 'admin123',
        error: ''
      });
    }
  }
  signUp = (event) => {
    event.preventDefault()
    const { name, email, password, userType, qualification, percentage, skill, description, gender, available, request } = this.state;

    if (percentage > 100) {
      this.setState({
        error: 'Percentage should below from 100'
      })
      return;
    }
    else if (percentage < 40) {
      this.setState({
        error: 'Percentage should above from 40'
      })
      return;
    }

    this.props.signInLoaderOpen()
    var user;
    if (userType === "student") {
      user = { name, email, userType, qualification, percentage, skill, description, gender, available, request };
    }
    else {
      user = { name, email, userType, available };
    }
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(res => {
        user.id = res.user.uid
        this.props.signUpUser(res.user.uid, user);
        this.setState({
          signIn: true,
        });
      }
      )
      .catch(err => {
        this.setState({ error: err.message });
        this.props.signInLoaderClose()
      })
  }

  signIn = (event) => {
    event.preventDefault()
    this.props.signInLoaderOpen()
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
        this.props.signInUser(res.user, this.props.history, true)

      })
      .catch(err => {
        this.setState({ error: err.message });
        this.props.signInLoaderClose()
      })

  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.signInUser(user, this.props.history, true);
      }
    })
  }
  render() {
    const { classes } = this.props
    return (
      <div>
        <Header history={this.props.history} />
        {this.state.signIn ?
          <div className="form signIn">
            <form onSubmit={this.signIn}>
              <h2>Login</h2>
              <p style={{ color: "red" }}>{this.state.error}</p>
              <TextField className={classes.inputField} label="Email" margin="normal" type="email" name="email" value={this.state.email} onChange={this.changeHandler} required /><br />
              <TextField className={classes.inputField} label="Password" margin="normal" type="password" name="password" value={this.state.password} onChange={this.changeHandler} required /><br /><br />
              {this.props.signInLoader ?
                <Loader /> :
                <Button variant="contained" color="primary" type="submit" value="submit">Sign In</Button>}
            </form>
            <p>Don't have account? | <span className="changeFormBtn" onClick={this.changeForm}>Sign Up</span></p>
          </div>
          :
          <div className="form">
            <form onSubmit={this.signUp}>
              <h2>Registration</h2>
              <p style={{ color: "red" }}>{this.state.error}</p>
              <FormControl component="fieldset" margin="normal">
                <RadioGroup style={{ flexDirection: 'row' }} name="userType" value={this.state.userType} onChange={this.changeHandler}>
                  <FormControlLabel value="student" control={<Radio color="primary" required={true} />} label="Student" />
                  <FormControlLabel value="company" control={<Radio color="primary" required={true} />} label="Company" />
                </RadioGroup>
              </FormControl><br />
              <TextField className={classes.inputField} label="Name" margin="normal" type="text" name="name" value={this.state.name} onChange={this.changeHandler} required /><br />
              <TextField className={classes.inputField} label="Email" margin="normal" type="email" name="email" value={this.state.email} onChange={this.changeHandler} required /><br />
              <TextField className={classes.inputField} label="Password" margin="normal" type="password" name="password" value={this.state.password} onChange={this.changeHandler} required /><br />
              {(this.state.userType === "student") &&
                <span>
                  <FormControl required className={classes.inputField}>
                    <InputLabel classes={{ root: classes.cssLabel, focused: classes.cssFocused, }}>Qualification</InputLabel>
                    <Select input={<Input classes={{ underline: classes.cssUnderline, }} />} style={{ textAlign: 'left' }} value={this.state.qualification} onChange={this.changeHandler} inputProps={{ name: 'qualification' }}>
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Matriculation">Matriculation</MenuItem>
                      <MenuItem value="Intermidiate">Intermidiate</MenuItem>
                      <MenuItem value="Gradutaion">Gradutaion</MenuItem>
                      <MenuItem value="Master">Master</MenuItem>
                    </Select>
                  </FormControl><br />

                  <TextField className={classes.inputField} label="Percentage in Academic Exam" margin="normal" type="number" name="percentage" value={this.state.percentage} onChange={this.changeHandler} required /><br />

                  <FormControl required className={classes.inputField}>
                    <InputLabel classes={{ root: classes.cssLabel, focused: classes.cssFocused, }}>Skill</InputLabel>
                    <Select input={<Input classes={{ underline: classes.cssUnderline, }} />} style={{ textAlign: 'left' }} value={this.state.skill} onChange={this.changeHandler} inputProps={{ name: 'skill' }}>
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Software Engenieer">Software Engenieer</MenuItem>
                      <MenuItem value="Web developer">Web developer</MenuItem>
                      <MenuItem value="Mobile App Developer">Mobile App Developer</MenuItem>
                      <MenuItem value="Graphic Designer">Graphic Designer</MenuItem>
                    </Select>
                  </FormControl><br />

                  <TextField className={classes.inputField} label="Description" margin="normal" type="text" name="description" value={this.state.description} onChange={this.changeHandler} multiline rowsMax="10" required /><br />

                  <FormControl required component="fieldset" margin="normal">
                    <FormLabel component="legend">Gender:</FormLabel>
                    <RadioGroup style={{ flexDirection: 'row' }} name="gender" value={this.state.gender} onChange={this.changeHandler}>
                      <FormControlLabel value="male" control={<Radio color="primary" required={true} />} label="Male" />
                      <FormControlLabel value="female" control={<Radio color="primary" required={true} />} label="Female" />
                    </RadioGroup>
                  </FormControl><br />
                </span>
              }
              {this.props.signInLoader ?
                <Loader /> :
                <Button variant="contained" color="primary" type="submit" value="submit">Sign Up</Button>}
            </form>
            <p>Already have account | <span className="changeFormBtn" onClick={this.changeForm}>Sign In</span></p>
          </div>}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    signInLoader: state.root.signInLoader
  }
}
function mapDispatchToProps(dispatch) {
  return {
    signUpUser: (uid, user) => dispatch(signUpUser(uid, user)),
    signInUser: (user, history, sign) => dispatch(signInUser(user, history, sign)),
    signInLoaderOpen: () => dispatch(signInLoaderOpen()),
    signInLoaderClose: () => dispatch(signInLoaderClose())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Sign));