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
import { signInUser, getCompanies, getCompaniesOnly, blockUser, unblockUser, deleteJob } from '../store/action/action'
import Dialog from '../components/dialogBox'

const styles = (theme) => ({
  tableWidth: {
    width: "100%"
  },
  screenChangeBtn: {
    position: "absolute",
    right: 10,
    top: 10
  },
});


class Company extends Component {
  constructor() {
    super();
    this.state = {
      changePage: false
    }
  }

  changePage = () => {
    this.setState({
      changePage: !this.state.changePage
    })
  }
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
    this.props.getCompaniesOnly()
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
    const { classes } = this.props
    console.log(this.props.companiesOnly)
    return (
      (this.props.profile && (this.props.profile.userType === "admin" || this.props.profile.userType === "student")) &&
      <div>
        {this.props.profile.available ?
          <div>
            {this.state.changePage ?
              <div>
                <Header history={this.props.history} value={0} />
                <h1>Companies<span><Button className={classes.screenChangeBtn} color="primary" variant="contained" onClick={this.changePage}>View Vacancies</Button></span></h1>
                {this.props.companiesOnly.length > 0 ?
                  <div>
                    {this.props.profile.userType === "admin" ?
                      <Table className={classes.tableWidth}>
                        <TableHead >
                          <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.props.companiesOnly.map((val, ind) =>
                            <TableRow key={ind}>
                              <TableCell>{ind + 1}</TableCell>
                              <TableCell>{val.name}</TableCell>
                              <TableCell>{val.email}</TableCell>

                              <TableCell>
                                {val.available ?
                                  <Button style={{ width: "max-content" }} variant="contained" color="secondary" onClick={() => { }} >Block Company</Button> :
                                  <Button style={{ backgroundColor: "green", width: "max-content" }} variant="contained" color="secondary" onClick={() => { }}>unblock Company</Button>}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      :
                      <Table className={classes.tableWidth}>
                      <TableHead >
                          <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.props.companiesOnly.map((val, ind) =>
                            <TableRow key={ind}>
                              <TableCell>{ind + 1}</TableCell>
                              <TableCell>{val.name}</TableCell>
                              <TableCell>{val.email}</TableCell>

                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    }
                  </div>
                  :
                  <p>No company available</p>
                }
              </div>
              :
              <div>
                <Header history={this.props.history} value={0} />
                <h1>Vacancies<span><Button className={classes.screenChangeBtn} color="primary" variant="contained" onClick={this.changePage}>View Companies</Button></span></h1>
                {this.props.companies.length > 0 ?
                  <div style={{ overflow: "auto" }}>
                    {this.props.profile.userType === "admin" ?
                      <Table className={classes.tableWidth}>
                        <TableHead >
                          <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Job</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Delete Job</TableCell>
                            {/* <TableCell>Action</TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.props.companies.map((val, ind) =>
                            <TableRow key={ind}>
                              <TableCell>{ind + 1}</TableCell>
                              <TableCell>{val.name}</TableCell>
                              <TableCell>{val.job}</TableCell>
                              <TableCell>
                                <Dialog name="Details" title={val.name} email={val.email} job={val.job} qualificationReq={val.qualificationReq} salary={val.salary} details={val.jobDetails} />
                              </TableCell>
                              <TableCell>
                                <Button style={{ width: "max-content" }} variant="outlined" color="secondary" onClick={() => this.delete(val.id, val.key)}>Delete Vacancy</Button>
                              </TableCell>
                              {/* <TableCell>
                                {val.available ?
                                  <Button style={{ width: "max-content" }} variant="contained" color="secondary" onClick={() => this.block(val.id)} >Block Company</Button> :
                                  <Button style={{ backgroundColor: "green", width: "max-content" }} variant="contained" color="secondary" onClick={() => this.unblock(val.id)}>unblock Company</Button>}
                              </TableCell> */}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      :
                      <Table className={classes.tableWidth}>
                        <TableHead >
                          <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Job</TableCell>
                            <TableCell>Details</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.props.companies.map((val, ind) =>
                            val.available &&
                            <TableRow key={ind}>
                              <TableCell>{ind + 1}</TableCell>
                              <TableCell>{val.name}</TableCell>
                              <TableCell>{val.job}</TableCell>
                              <TableCell>
                                <Dialog name="Details" title={val.name} email={val.email} job={val.job} qualificationReq={val.qualificationReq} salary={val.salary} details={val.jobDetails} />
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    }

                  </div>
                  :
                  <p>No vacancy available</p>}
              </div>}
          </div>
          :
          <p>Sorry, you have been blocked by the admin</p>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.root.profile,
    companies: state.root.companies,
    companiesOnly: state.root.companiesOnly
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getCompanies: () => dispatch(getCompanies()),
    getCompaniesOnly: () => dispatch(getCompaniesOnly()),
    blockUser: (id) => dispatch(blockUser(id)),
    unblockUser: (id) => dispatch(unblockUser(id)),
    signInUser: (user, history) => dispatch(signInUser(user, history)),
    deleteJob: (id, key) => dispatch(deleteJob(id, key))
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Company));