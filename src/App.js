import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Sign from './pages/sign';
import Job from '././pages/job';
import Students from './pages/students';
import Companies from './pages/companies';
import Profile from './pages/profile'

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
          <Route exact path="/" component={Sign}/>
         
          <div>
            <Route exact path="/job" component={Job}/>
            <Route exact path="/students" component={Students}/>
            <Route exact path="/companies" component={Companies}/>
            <Route exact path="/profile" component={Profile}/>
          </div>
          
      </div>
      </Router>
    );
  }
}
function mapStateToProps(state){
  return {
      profile:state.root.profile
  }
}
function mapDispatchToProps(dispatch){
  return {
   
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(App)


