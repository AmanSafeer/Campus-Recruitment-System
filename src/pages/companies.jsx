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
    margin: 8
  },
});

let count = 0

const counter = () => {
  count++
}
const resetCounter = () => {
  count = 0
}

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
        {this.state.changePage ?
          <div>
            <Header history={this.props.history} value={0} />
            <h1>Companies</h1>
            <div style={{ textAlign: "right" }}><Button className={classes.screenChangeBtn} color="primary" variant="contained" onClick={this.changePage}>View Vacancies</Button></div>
            {this.props.profile.available ?
              <div>
                {this.props.companiesOnly.length > 0 ?
                  <div>
                    {this.props.profile.userType === "admin" ?
                      <Table className={classes.tableWidth}>
                        <TableHead >
                          <TableRow>
                            <TableCell style={{ textAlign: "center" }}>Id</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Name</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Email</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.props.companiesOnly.map((val, ind) =>
                            <TableRow key={ind}>
                              <TableCell style={{ textAlign: "center" }}>{ind + 1}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>{val.name}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>{val.email}</TableCell>

                              <TableCell style={{ textAlign: "center" }}>
                                {val.available ?
                                  <Button style={{ color: "red", borderColor: "red", borderWidth: 1, width: "max-content" }} variant="outlined" onClick={() => { this.block(val.id) }} >Block Company</Button> :
                                  <Button style={{ color: "green", borderColor: "green", borderWidth: 1, width: "max-content" }} variant="outlined" onClick={() => { this.unblock(val.id) }}>unblock Company</Button>}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      :
                      <Table className={classes.tableWidth}>
                        <TableHead >
                          <TableRow>
                            <TableCell style={{ textAlign: "center" }}>Id</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Name</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Email</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {resetCounter()}
                          {this.props.companiesOnly.map((val, ind) =>
                            <TableRow key={ind}>
                              {counter()}
                              <TableCell style={{ textAlign: "center" }}>{count}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>{val.name}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>{val.email}</TableCell>

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
              <p>Sorry, you have been blocked by the admin</p>}
          </div>
          :
          <div>
            <Header history={this.props.history} value={0} />
            <h1>Vacancies</h1>
            {this.props.profile.userType === "admin" && <div style={{ textAlign: "right" }}><Button className={classes.screenChangeBtn} color="primary" variant="contained" onClick={this.changePage}>View Companies</Button></div>}
            {this.props.profile.available ?
              <div>
                {this.props.companies.length > 0 ?
                  <div style={{ overflow: "auto" }}>
                    {this.props.profile.userType === "admin" ?
                      <Table className={classes.tableWidth}>
                        <TableHead >
                          <TableRow>
                            <TableCell style={{ textAlign: "center" }}>Id</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Name</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Job</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Details</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Delete Vacancy</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                       
                          {this.props.companies.map((val, ind) =>
                            <TableRow key={ind}>
                              <TableCell style={{ textAlign: "center" }}>{ind + 1}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>{val.name}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>{val.job}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                <Dialog name="Details" title={val.name} email={val.email} job={val.job} qualificationReq={val.qualificationReq} salary={val.salary} details={val.jobDetails} />
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                <Button style={{ width: "max-content" }} variant="outlined" color="secondary" onClick={() => this.delete(val.id, val.key)}>Delete</Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      :
                      <Table className={classes.tableWidth}>
                        <TableHead >
                          <TableRow>
                            <TableCell style={{ textAlign: "center" }}>Id</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Name</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Job</TableCell>
                            <TableCell style={{ textAlign: "center" }}>Details</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                        {resetCounter()}
                          {this.props.companies.map((val, ind) =>
                            val.available &&
                            <TableRow key={ind}>
                              {counter()}
                              <TableCell style={{ textAlign: "center" }}>{count}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>{val.name}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>{val.job}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                <Dialog name="Details" title={val.name} email={val.email} job={val.job} qualificationReq={val.qualificationReq} salary={val.salary} details={val.jobDetails} />
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    }

                  </div>
                  :
                  <p>No vacancy available</p>
                }
              </div>
              :
              <p>Sorry, you have been blocked by the admin</p>}
          </div>}



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