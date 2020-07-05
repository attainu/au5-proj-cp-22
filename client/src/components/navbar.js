import React,{useContext, useRef,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'


const NavBar =()=>{
  const searchModal = useRef(null);
  const dropModal = useRef(null);
  const [display, setDisplay] = useState(false);
  const [search,setSearch] = useState([])
  const [userDetails,setUsersdetails] = useState([])
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()

  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])
  useEffect(()=>{
    M.Modal.init(dropModal.current)
  },[])
  
  const renderList = () =>{

    if(state){
       return[
        
        <ul className="tabs tabs-transparent">
        <li>
        <li key="2"><i data-target="modal1" className="search modal-trigger large material-icons "   style={{color:"black",fontSize:"44px",marginTop:"-10px",padding:"5px",widthLeft:"100px"}} title="search">search</i></li>
        <li key="1"><Link to={state?"/" :""} ><i className="logos modal-trigger large material-icons" style={{fontSize:"44px",marginTop:"-4px",padding:"5px",marginRight:"0px",float:"left"}}>home</i></Link></li>
        <li key="3"><Link to="/profile"><img  title="profile" classname="pic"
                                    style={{width:"40px",height:"40px",borderRadius:"160px",marginBottom:"10px"}} 
                                    src={state.pic}/></Link>
        </li>
        <li key="4"><Link to="/createpost"><p title="Create post" style={{fontSize:"24px",marginTop:"-13px",fontWeight:"bold"}} className="bb">Create post</p></Link></li>
        <li key="5"><Link to="/explore" ><p  title="explore" style={{fontSize:"24px",marginTop:"-12px",fontWeight:"bold"}} className="c">Explore</p> </Link></li>
        <li key="7"><Link to="/explore" ><i  title="explore" style={{fontSize:"24px",marginTop:"-12px"}} className="ee icons material-icons">explore</i> </Link></li>
          <li style={{color:"black",backgroundColor:"darkcyan",borderRadius:"0px",color:"red",marginTop:"-13px",fontSize:"24px",padding:"3px",fontWeight:"bold"}} className=" btnss"
              onClick={()=>{localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push('/login')
            }}>
                Logout
            </li>
            <li>
            <li key="7" className="log"><i data-target="mo" className="logg modal-trigger large material-icons "   style={{color:"black",fontSize:"44px",marginTop:"-10px",padding:"5px"}} title="more">more_vert</i></li>
            </li>
        </li>
        </ul>

       ]
    }
  }
// api to fetch posts of user
const fetchUsers = (query) =>{
setSearch(query)
fetch("/search-users",{
  method:"post",
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify({
    query
  })
}).then(res=>res.json())
.then(results=>{
  console.log(results)
  setUsersdetails(results.user)
})
  }
  return(
    <nav>
    <div className="nav-wrapper">
    <Link to={state?"/" :"/login"} className="brand-logo left"><p className="logo">Appogram</p></Link>
      <ul id="nav-mobile" className="right">
       {renderList()}
      </ul>
    </div>
    <div style={{color:"black"}} id="modal1" class="modal" ref={searchModal}>
    <div className="card-content">
      <h4>Search user with username</h4>
     <input type="text" 
            placeholder="search with username"
            value ={search}
            onChange = {(e)=>fetchUsers(e.target.value)}
            /> 
    <ul class="collection">
        {userDetails.map(item=>{
          return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
            M.Modal.getInstance(searchModal.current).close()
            setSearch('')}} ><li class="collection-item avatar">
            <img style={{width:"52px",height:"52px",borderRadius:"190px",marginTop:"8px"}} src={item.pic} alt={item.pic} class="circle"/>
            <span className="title"><h6 style={{textAlign:"left",fontWeight:"bold",paddingLeft:"2px"}}>{item.name}</h6></span>
            <span>{item.email}</span>
          </li></Link> 
        })}
        
      </ul>
    </div>
    {/* ..........MODAL............ */}
    <div className="modal-footer">
      <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</a>
    </div>
  </div>
  <div style={{color:"black"}} id="mo" class="modal" ref={dropModal}>
    <div className="card-content">
     
    <ul class="collection"> 
      <li className="b" onClick={()=>{ localStorage.clear()
       M.Modal.getInstance(dropModal.current).close()
              dispatch({type:"CLEAR"})
              history.push('/login')
            }}  key="2">Logout</li><br/>
      <li onClick={()=>{ 
       M.Modal.getInstance(dropModal.current).close()}}><Link to="/createpost" className="b">Create post</Link></li>
      
      </ul>
    </div>
    
  </div>
  </nav>
 
  )

 }

export default NavBar