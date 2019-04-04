import actionTypes from '../constants/constant';
import * as firebase from 'firebase';
import '../../fbConfig'


const ref = firebase.database().ref('/')

export function signUpUser(uid, user) {
    return (dispatch) => {
        ref.child(uid).set(user);
        dispatch({ type: actionTypes.SIGNIN_LOADER_CLOSE })
    }
}
export function signInUser(user, history, sign) {
    return (dispatch) => {
        if (sign) {
            ref.child(user.uid).once('value', snap => {
                const userData = snap.val();
                dispatch({ type: actionTypes.SIGNIN, payload: userData, userId: user.uid })
                if (userData.userType === "admin") {
                    history.replace('/companies');
                }
                else if (userData.userType === "student") {
                    history.replace('/companies');
                }
                else {
                    history.replace('/job');
                }
                dispatch({ type: actionTypes.SIGNIN_LOADER_CLOSE })
            })
        }
        else {
            ref.child(user.uid).on('value', snap => {
                const userData = snap.val();
                dispatch({ type: actionTypes.SIGNIN, payload: userData, userId: user.uid })
            })
        }
    }
}

export function signInLoaderOpen() {
    return (dispatch) => {
        dispatch({ type: actionTypes.SIGNIN_LOADER_OPEN })
    }
}
export function signInLoaderClose() {
    return (dispatch) => {
        dispatch({ type: actionTypes.SIGNIN_LOADER_CLOSE })
    }
}

export function signOutUser() {
    return (dispatch) => {
        dispatch({ type: actionTypes.SIGNOUT })
    }
}
export function postJob(obj, uid) {
    return (dispatch) => {
        ref.child(uid).once("value", snap => {
            const data = snap.val()
            if (data) {
                obj.name = data.name;
                obj.email = data.email;
                obj.id = data.id
                obj.available = true
                ref.child(uid).child("jobs").push(obj)
            }
        })
    }
}
export function getStudents() {
    return (dispatch) => {
        ref.on("value", snap => {
            const data = snap.val();
            const userArr = []
            if (data) {
                for (var key in data) {
                    const user = data[key]
                    if (user.userType === "student") {
                        userArr.push(user)
                    }
                }
            }
            dispatch({ type: actionTypes.GETSTUDENTS, payload: userArr })
        })
    }
}
export function getCompanies() {
    return (dispatch) => {
        ref.on("value", snap => {
            const data = snap.val();
            const userArr = []
            if (data) {
                for (var key in data) {
                    const user = data[key]
                    if (user.userType === "company") {
                        if (user.jobs) {
                            const jobs = user.jobs
                            for (var id in jobs) {
                                const job = jobs[id]
                                job.key = id
                                userArr.push(job)
                            }
                        }
                    }
                }
            }
            dispatch({ type: actionTypes.GETCOMPANIES, payload: userArr })
        })
    }
}
export function getCompaniesOnly() {
    return (dispatch) => {
        ref.on("value", snap => {
            const data = snap.val();
            const userArr = []
            if (data) {
                for (var key in data) {
                    const user = data[key]
                    if (user.userType === "company") {
                        userArr.push(user)
                       console.log(user)
                    } 
                }
            }
            dispatch({ type: actionTypes.GETCOMPANIESONLY, payload: userArr })
        })
    }
}

export function request(id, profile) {
    return (dispatch) => {
        ref.child('KdlZMj1UT7Nz3bJXPnhRB955Bw93').child("requests").child(id).set(profile)
        ref.child(id).update({ request: true });
        ref.child(id).once('value', snap => {
            const user = snap.val();
            dispatch({ type: actionTypes.REQUEST, payload: user });
        })
    }
}

export function requestedData(id) {
    return (dispatch) => {
        ref.child('KdlZMj1UT7Nz3bJXPnhRB955Bw93').child("requests").child(id).once('value', snap => {
            const data = snap.val();
            dispatch({ type: actionTypes.REQUESTED_DATA, payload: data });
        })
    }
}

export function update(id) {
    return (dispatch) => {
        ref.child('KdlZMj1UT7Nz3bJXPnhRB955Bw93').child("requests").child(id).once('value', snap => {
            const data = snap.val();
            data.request = false
            ref.child(id).update(data)
            ref.child('KdlZMj1UT7Nz3bJXPnhRB955Bw93').child("requests").child(id).remove()
        })
    }
}


export function blockUser(id) {
    return (dispatch) => {
        ref.child(id).update({ available: false })
        ref.child(id).child("jobs").once("value", snap => {
            const data = snap.val();
            if (data) {
                for (var key in data) {
                    ref.child(id).child("jobs").child(key).update({ available: false });
                }
            }
        })

    }
}

export function unblockUser(id) {
    return (dispatch) => {
        ref.child(id).update({ available: true })
        ref.child(id).child("jobs").once("value", snap => {
            const data = snap.val();
            if (data) {
                for (var key in data) {
                    ref.child(id).child("jobs").child(key).update({ available: true });
                }
            }
        })

    }
}

export function deleteJob(id, key) {
    return (dispatch) => {
        ref.child(id).child("jobs").child(key).remove()
    }
}