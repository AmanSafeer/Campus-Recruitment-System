import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers/index'

import thunk from 'redux-thunk';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
    rootReducer,
    {},
    composeEnhancers(applyMiddleware(thunk))
);

//store.subscribe(()=>{
//   console.log(store.getState());
//})

export default store;