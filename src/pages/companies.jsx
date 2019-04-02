import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Header from '../components/header'
import { signInUser, getCompanies, blockUser, unblockUser, deleteJob } from '../store/action/action'
import Dialog from '../components/dialogBox'

const styles = (theme) => ({
  red: {
    backgroundColor: "rgba(247,0,0,0.5)"
  },
});


class Company extends Component {

  block = (id) => {
    this.props.blockUser(id)
  }
  unblock = (id) => {
    this.props.unblockUser(id)
  }
  delete = (id, key) => {
    this.props.deleteJob(id, key)
  }
  getData = () => {
    this.props.getCompanies()
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.signInUser(user, this.props.history);
        this.getData()
      }
    })
  }

  render() {
    return (
      (this.props.profile && (this.props.profile.userType === "admin" || this.props.profile.userType === "student")) &&
      <div>
        <Header history={this.props.history} value={0} />
        <h1>Companies</h1>
        {this.props.profile.available ?
          <div>
            {this.props.companies.length > 0 ?
              <div style={{ overflow: "auto" }}>
                {this.props.profile.userType === "admin" ?
                  <Table>
                    <TableHead >
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell><TableCell>Job</TableCell>
                        <TableCell>Qualification Required</TableCell><TableCell>Salary</TableCell>
                        <TableCell>Job Details</TableCell>
                        <TableCell>Admin Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.companies.map((val, ind) =>
                        <TableRow key={ind}>
                          <TableCell>{ind + 1}</TableCell>
                          {val.available ?
                            <TableCell>{val.name}</TableCell>
                            :
                            <TableCell style={{ backgroundColor: "rgba(247,0,0,0.4)" }}>{val.name}</TableCell>}
                          <TableCell>{val.email}</TableCell><TableCell>{val.job}</TableCell>
                          <TableCell>{val.qualificationReq}</TableCell><TableCell>{val.salary}</TableCell>
                          <TableCell>
                            <Dialog name="Job Details" title={val.job} details={val.jobDetails} />
                          </TableCell>
                          <TableCell>
                            <Button style={{ width: "max-content" }} variant="outlined" color="secondary" onClick={() => this.delete(val.id, val.key)}>Delete Job</Button>
                            {val.available ?
                              <Button style={{ width: "max-content" }} variant="contained" color="secondary" onClick={() => this.block(val.id)} >Block Company</Button> :
                              <Button style={{ backgroundColor: "green", width: "max-content" }} variant="contained" color="secondary" onClick={() => this.unblock(val.id)}>unblock Company</Button>}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  :
                  <Table>
                    <TableHead >
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell><TableCell>Job</TableCell>
                        <TableCell>Qualification Required</TableCell><TableCell>Salary</TableCell>
                        <TableCell>Job Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.companies.map((val, ind) =>
                        val.available &&
                        <TableRow key={ind}>
                          <TableCell>{ind + 1}</TableCell>
                          <TableCell>{val.name}</TableCell>
                          <TableCell>{val.email}</TableCell><TableCell>{val.job}</TableCell>
                          <TableCell>{val.qualificationReq}</TableCell><TableCell>{val.salary}</TableCell>
                          <TableCell>
                            <Dialog name="Job Details" title={val.job} details={val.jobDetails} />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                }

              </div>
              :
              <p>No company available</p>}
          </div>
          :
          <p>Sorry, you have been blocked by the admin</p>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.root.profile,
    companies: state.root.companies
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getCompanies: () => dispatch(getCompanies()),
    blockUser: (id) => dispatch(blockUser(id)),
    unblockUser: (id) => dispatch(unblockUser(id)),
    signInUser: (user, history) => dispatch(signInUser(user, history)),
    deleteJob: (id, key) => dispatch(deleteJob(id, key))
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Company));