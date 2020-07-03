import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'



const NavBar =()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList = () =>{
    if(state){
       return[
        <ul class="tabs tabs-transparent">
        <li><Link to="/profile">Profile</Link>
        </li>,
        <li><Link to="/createpost">createpost</Link></li>,
        <li><Link to="/myfollowingPost" >My following </Link></li>,
        <li>
          <button style={{color:"black",backgroundColor:"white"}} className="logout btn"
              
              onClick={()=>{localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push('/login')
            }}>
                Logout
            </button>
        </li>
        </ul>

       ]
    }
  }
  return(
    <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/" :"/login"} className="brand-logo left"><p className="logo">Appogram</p></Link>
      <ul id="nav-mobile" className="right">
       {renderList()}
      </ul>
    </div>
  </nav>
  )
}

export default NavBar