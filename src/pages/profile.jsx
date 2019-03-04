import React, { Component } from 'react';
import {connect} from 'react-redux';
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
import Header from '../components/header'
import * as firebase from 'firebase'
import {signInUser,request} from '../store/action/action'


const styles =(theme)=>({
  form:{
    width:"100%",
    overflow:"hidden"
  },
  inputField:{
    width:"80%",
  },
});


class Profile extends Component {
  constructor(props){
    super(props)
    this.state={
      name:'',
      qualification:'',
      skill:'',
      percentage:'',
      gender:'',
      description:'',
      oldProfile:null,
      error:""
    }
  }
  changeHandler=(event)=>{
    this.setState({
      [event.target.name]:event.target.value,
      error:''
    });
  }
  setData=(nextProps)=>{
    const {name,qualification,skill,percentage,gender,description}=nextProps.profile
    const profile={name,qualification,skill,percentage,gender,description}
    this.setState({
      name:name,
      qualification:qualification,
      skill:skill,
      percentage:percentage,
      gender:gender,
      description:description,
      oldProfile:profile,
    })
  }
  updateRequest=(event,id)=>{
    event.preventDefault()
    const {name,qualification,skill,percentage,gender,description}=this.state
    const old=this.state.oldProfile
  
    if(name === old.name && qualification === old.qualification && skill === old.skill && percentage === old.percentage && gender === old.gender && description === old.description){
      this.setState({
        error:'no changes in profile'
      })
      return;
    }

    if(percentage > 100){
      this.setState({
        error:'Percentage should below from 100'
      })
      return;
    }
   
    const profile={name,qualification,skill,percentage,gender,description} 
    this.props.request(id,profile)

  }
  componentDidUpdate(prevProps) {
    if (this.props.profile !== prevProps.profile) {
        this.setData(this.props);
    }
  }
  
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        this.props.signInUser(user, this.props.history);        
      }
  })
  }
  render() {
    const {classes}=this.props
    return (
      ( this.props.profile && this.props.profile.userType === "student") &&
      <div>
        <Header history={this.props.history} value={1}/>
       <h1>Profile</h1>
       <p style={{color:"red"}}>{this.state.error}</p>
       {this.props.profile.available ?
        <form style={styles.form}>
            <TextField className={classes.inputField} label="Name"  margin="normal"  type="text" name="name" value={this.state.name} onChange={this.changeHandler} required/><br/>
                    <FormControl required className={classes.inputField}>
                      <InputLabel classes={{ root: classes.cssLabel,focused: classes.cssFocused, }}>Qualification</InputLabel>
                      <Select input={<Input classes={{underline: classes.cssUnderline,}}/>} style={{textAlign:'left'}} value={this.state.qualification} onChange={this.changeHandler} inputProps={{ name: 'qualification'}}>
                        <MenuItem  value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Matriculation">Matriculation</MenuItem>
                        <MenuItem value="Intermidiate">Intermidiate</MenuItem>
                        <MenuItem value="Gradutaion">Gradutaion</MenuItem>
                        <MenuItem value="Master">Master</MenuItem>
                      </Select>
                    </FormControl><br/>

                    <TextField className={classes.inputField} label="Percentage in Academic Exam" margin="normal" type="number" name="percentage" value={this.state.percentage} onChange={this.changeHandler} required/><br/> 

                    <FormControl required className={classes.inputField}>
                      <InputLabel classes={{ root: classes.cssLabel,focused: classes.cssFocused, }}>Skill</InputLabel>
                      <Select input={<Input classes={{underline: classes.cssUnderline,}}/>} style={{textAlign:'left'}} value={this.state.skill} onChange={this.changeHandler} inputProps={{ name: 'skill'}}>
                        <MenuItem  value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Software Engenieer">Software Engenieer</MenuItem>
                        <MenuItem value="Web developer">Web developer</MenuItem>
                        <MenuItem value="Mobile App Developer">Mobile App Developer</MenuItem>
                        <MenuItem value="Graphic Designer">Graphic Designer</MenuItem>
                      </Select>
                    </FormControl><br/> 

                    <TextField className={classes.inputField} label="Description" margin="normal" type="text" name="description" value={this.state.description} onChange={this.changeHandler} multiline rowsMax="10" required/><br/>

                  <FormControl required component="fieldset" margin="normal">
                    <FormLabel  component="legend">Gender:</FormLabel>
                      <RadioGroup style={{flexDirection:'row'}} name="gender" value={this.state.gender} onChange={this.changeHandler}>
                        <FormControlLabel value="male" control={<Radio color="primary" required={true}/>}  label="Male" />
                        <FormControlLabel value="female" control={<Radio color="primary" required={true}/>}  label="Female" />
                      </RadioGroup>
                  </FormControl><br/>
                 
                <Button variant="contained" color="primary" type="submit" value="submit" onClick={(event)=>this.updateRequest(event,this.props.profile.id)}>Request for Update</Button><br/>
                {this.props.profile.request && <p style={{color:"gray"}}>Request on pending</p>}
        </form>:
        <div>
          <p>Sorry, you have been blocked by the admin</p>
        </div>
       }
            
      </div>
    );
  }
}

function mapStateToProps(state){
    return {
        profile:state.root.profile,
    }
  }
  function mapDispatchToProps(dispatch){
    return {
      request:(id,profile)=>dispatch(request(id,profile)),
      signInUser: (user,history)=> dispatch(signInUser(user,history)),
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Profile));