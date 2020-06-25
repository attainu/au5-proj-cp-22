import React,{useEffect,createContext,useReducer,useContext, useState} from 'react';
import NavBar from './components/navbar'
import './App.css'
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/home'
import Profile from './components/profile'
import Login from './components/login'
import Signup from './components/signup'
import CreatePost from './components/createPost'
import Userprofile from './components/Userprofile'
import FollowingPost from './components/followingPost'
import UpdateProfile from './components/editProfile'
import Reset from './components/Reset'
import Newpass from './components/newpass'
import {reducer,initialState} from './reducers/userReducer'




export const UserContext = createContext()
 
const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
      // history.push('/')
    }
    else{
      if(!history.location.pathname.startsWith('/reset'))
      history.push('/login')
    }
  },[])
  return(
    <Switch>
      <Route exact path="/" >
      <Home/>
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile/>
      </Route>
      
      <Route path="/createpost">
        <CreatePost/>
      </Route>
      
      <Route path="/profile/:userid">
        <Userprofile/>
      </Route>
      <Route path="/myfollowingPost">
        <FollowingPost/>
      </Route>
      <Route path="/updateProfile/:userid">
        <UpdateProfile/>
      </Route>
      <Route exact  path="/reset">
        <Reset/>
      </Route>
      <Route path="/reset/:token">
        <Newpass/>
      </Route>
     
     
     
      
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)

  return (
    <UserContext.Provider value={{state,dispatch}}>
    
    <BrowserRouter>
       <NavBar />
       <Routing />
       
      
    </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
