import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase'
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button'
import { signOutUser } from '../store/action/action'

import Menu from './menu'


const styles = (theme) => ({
  header: {
    flexGrow: 0,
  },
  appBar: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#303f9f',
    padding: 5
  },
  appBarLogin: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#303f9f',
    padding: 10
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  signOut: {
    marginRight: 5
  },
  user: {
    background: "#303f9f",
    fontSize: "14px",
    color: "white",
    padding: "0px 10px",
    fontWeight: "bold"
  },
  tabsRoot: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10
  },

  tabsIndicator: {
    backgroundColor: '#303f9f',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 2,
    fontSize: 14,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#303f9f',
      opacity: 1,

    },
    '&$tabSelected': {
      color: '#303f9f',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#303f9f',
    },
  },
  tabSelected: {
    color: '#303f9f',
    fontWeight: theme.typography.fontWeightMedium
  },
  typography: {
    padding: theme.spacing.unit * 3,
  },

});


class Header extends Component {
  constructor(props) {
    super(props)
    this.media = window.matchMedia("(max-width: 900px)")
    this.state = {
      value: props.value,
      screenBreak: false
    };
  }


  handleChange = (event, value) => {
    this.setState({ value });
  };

  pageChange = (page) => {
    this.props.history.push(page)
  }
  screenChange = (screen) => {
    if (screen.matches) {
      this.setState({ screenBreak: true })
    } else {
      this.setState({ screenBreak: false })

    }
  }
  signOut = () => {
    firebase.auth().signOut()
      .then(() => {
        this.props.history.replace('/')
        this.props.signOutUser()
      })
      .catch((err) => {
        alert(err)
      })
  }

  componentDidMount() {
    this.screenChange(this.media)
    this.media.addListener(this.screenChange)
  }
  componentWillUnmount() {
    this.media.removeListener(this.screenChange)

  }
  render() {
    const { classes } = this.props;
    const { value } = this.props;
    return (
      <header className={classes.header}>
        <AppBar position="static" color="default" className={this.props.menu ? classes.appBar : classes.appBarLogin}>
          <Toolbar>
            <div className="topHeading">
              <span className={classes.heading}>Campus Recruitment System</span>
            </div>
          </Toolbar>
          {this.props.menu &&
            <div>
              {!this.state.screenBreak ?
                <Tabs value={value} onChange={this.handleChange} classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }} >
                  {this.props.profile.userType === "company" && <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Post Vacancy" onClick={() => this.pageChange('/job')} />}
                  {this.props.profile.userType !== "company" && <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Vacancies" onClick={() => this.pageChange('/companies')} />}
                  {this.props.profile.userType === "student" && <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Profile" onClick={() => this.pageChange('/profile')} />}
                  {this.props.profile.userType !== "student" && <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Students " onClick={() => this.pageChange('/students')} />}

                  <Button className={classes.signOut} variant="contained" color="secondary" margin="normal" onClick={this.signOut}>Logout</Button>
                  <span className={classes.user}>{this.props.profile.name}<br />({this.props.profile.userType})</span>
                </Tabs>
                :
                <Menu navigation={this.pageChange} signOut={this.signOut} profile={this.props.profile} />
              }
            </div>
          }
        </AppBar>
      </header>
    );
  }
}
Header.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    profile: state.root.profile,
    menu: state.root.menu
  }
}
function mapDispatchToProps(dispatch) {
  return {
    signOutUser: () => dispatch(signOutUser())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header));
