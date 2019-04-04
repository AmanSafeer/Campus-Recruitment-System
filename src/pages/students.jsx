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
import { signInUser, getStudents, blockUser, unblockUser, update, requestedData } from '../store/action/action'
import Dialog from '../components/dialogBox'

const styles = (theme) => ({
  tableWidth:{
    width:"100%"
  }
});


class Student extends Component {

  update = (id) => {
    this.props.update(id)
  }
  block = (id) => {
    this.props.blockUser(id)
  }
  unblock = (id) => {
    this.props.unblockUser(id)
  }

  getData = () => {
    this.props.getStudents()
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
    return (
      (this.props.profile && (this.props.profile.userType === "admin" || this.props.profile.userType === "company")) &&
      <div>
        <Header history={this.props.history} value={1} />
        <h1>Students</h1>
        {this.props.profile.available ?
          <div>
            {this.props.students.length > 0 ?
              <div style={{ overflow: "auto" }}>
                {this.props.profile.userType === "admin" ?
                  <Table className={classes.tableWidth}>
                    <TableHead >
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Skill</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Updation</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.students.map((val, ind) =>
                        <TableRow key={ind}>
                          <TableCell>{ind + 1}</TableCell>
                            <TableCell>{val.name}</TableCell>
                          <TableCell>{val.skill}</TableCell>
                          <TableCell>
                            <Dialog name="Details" type="student" title={val.name} email={val.email} gender={val.gender} qualification={val.qualification} percentage={val.percentage} details={val.description} skill={val.skill} />
                          </TableCell>
                          <TableCell>
                            {val.request ?
                              <Dialog name="View Update" updation={this.props.updation} requestedData={() => this.props.requestedData(val.id)} action={() => this.update(val.id)} update={true} /> :
                              <Button variant="outlined" disabled >View Update</Button>
                            }
                          </TableCell>
                          <TableCell>
                            {val.available ?
                              <Button style={{ width: "max-content" }} variant="contained" color="secondary" onClick={() => this.block(val.id)}>Block Student</Button> :
                              <Button style={{ backgroundColor: "green", width: "max-content" }} variant="contained" color="secondary" onClick={() => this.unblock(val.id)}>Unblock Student</Button>}
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
                        <TableCell>Skill</TableCell>
                        <TableCell>Detials</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.students.map((val, ind) =>
                        val.available &&
                        <TableRow key={ind}>
                          <TableCell>{ind + 1}</TableCell>
                          <TableCell>{val.name}</TableCell>
                          <TableCell>{val.skill}</TableCell>
                          <TableCell>
                            <Dialog name="Details" type="student" title={val.name} email={val.email} gender={val.gender} qualification={val.qualification} percentage={val.percentage} details={val.description} skill={val.skill} />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>}

              </div>
              :
              <p>No Student available</p>}
          </div> :
          <p>Sorry, you have been blocked by the admin</p>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.root.profile,
    students: state.root.students,
    updation: state.root.updation
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getStudents: () => dispatch(getStudents()),
    blockUser: (id) => dispatch(blockUser(id)),
    unblockUser: (id) => dispatch(unblockUser(id)),
    update: (id) => dispatch(update(id)),
    requestedData: (id) => dispatch(requestedData(id)),
    signInUser: (user, history) => dispatch(signInUser(user, history))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Student));