import React,{useEffect,useState,useContext,useRef} from 'react'
import {Route, Link} from 'react-router-dom'
import {UserContext} from '../App'
import {useParams} from 'react-router-dom'
import Spinner from 'reactjs-simple-spinner'
import M from 'materialize-css'



const UserProfile =()=>{
    const u1 = useRef(null)
    const u2 = useRef(null)
    const u3 = useRef(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [userprofile,setProfile] = useState(null)
    const [follow,setFollow] = useState(null)
    const [data,setData] = useState([])
    const [show,setShow] = useState(false)
    const [us,setOtherusers] = useState([])
    const [u,setOtheruserfollowers] = useState([])
    const [showfollow,setShowFollow] = useState(state?state.following.includes(userid):true)
    // console.log("userprofile",userprofile)
    useEffect(()=>{
        M.Modal.init(u1.current)
      },[])
      useEffect(()=>{
        M.Modal.init(u2.current)
      },[])
      useEffect(()=>{
        M.Modal.init(u3.current)
      },[])
    // others user profile fecth
useEffect(()=>{
    fetch(`/user/${userid}`,{
       method:"GET",
       headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    }
    }).then(res=>res.json())
    .then(result=>{
    setProfile(result)
    console.log("result",userid)
    }).catch(err=>{
    console.log(err)
    })
},[])

// Followers & following name
useEffect(()=>{
    fetch(`/Otherfollow/${userid}`,{
        method:"GET",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        
        setFollow(result)
        console.log("resultssss",result)
    }).catch(err=>{
        console.log(err)
    })
},[])

// fetch api for follow request
const followUser = ()=>{
    fetch("/follow",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            followId:userid
        })
    }).then(res=>res.json())
    .then(data=>{
        console.log(data)
        dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
        localStorage.setItem("user",JSON.stringify(data))
        setProfile((prevState)=>{
            return{
                ...prevState,
                user:{
                    ...prevState.user,
                    followers:[...prevState.user.followers,data._id]
                }
            }
        })
        setShowFollow(false)
    })
}
// fetch api for unfollow user
const unfollowUser = ()=>{
    fetch("/unfollow",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            unfollowId:userid
        })
    }).then(res=>res.json())
    .then(data=>{
        // console.log(data)
        dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
        localStorage.setItem("user",JSON.stringify(data))
        setProfile((prevState)=>{
        const newFollower =  prevState.user.followers.filter(item=>item != data._id)
            return{
                ...prevState,
                user:{
                    ...prevState.user,
                    followers:newFollower
                }
            }
        })
        setShowFollow(true)
    })
}
// api for following details of user
useEffect(()=>{
    fetch("/following",{
        methos:"get",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res =>res.json())
    .then(result=>{
        console.log("u",result)
        setOtherusers(result.user)
        // console.log("new",newData)
    })
},[])
// api for follower details
 useEffect(()=>{
    fetch("/followers",{
        methos:"get",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res =>res.json())
    .then(result=>{
        console.log("use",result)
        setOtheruserfollowers(result.user)
        // console.log("new",newData)
    })
},[])
// api for like post
const likePost = (id)=>{
    fetch("/like",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
         // console.log(result)
         const newData = data.map(item=>{
            if(item._id == result._id){
                return result
            }
            else{
                return item
            }
        })
        setData(newData)
    }).catch(err=>{
        console.log(err)
    })
}
// api for unlike post
const unlikePost = (id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
}
// api for post comment
const postComment = (text,postId)=>{
    fetch("/comment",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:postId,
            text:text
        })
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newDataComment = data.map(item=>{
            if(item._id==result._id){
                return result
            }
            else{
                return item
            }
        })
        setData(newDataComment)
    }).catch(err=>{
        console.log(err)
    })
}
// toggle for show comments
const toogle=()=>{
    setShow(!show)
}
    return(
        <div style={{marginTop:"80px"}}>
        {!userprofile?<Spinner size="huge" lineSize={12} lineFgColor="#009999" fontSize={20} message="Loading profile..."/>:
        
        <div style={{
            maxWidth:"550px",
            margin:"0px auto",
            marginTop:"100px"
            }}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px", 
                
                }}>
                <div className="prof">
                    <img className="imgg" style={{
                        width:"170px",
                        height:"170px",
                        borderRadius:"90px",
                        borderColor:"black",
                        marginTop:"15px",
                    }}
                        src = {userprofile.user.pic}
                        />
                </div>

                <div>
                    <div className="pname" 
                       style={{fontSize:"35px",marginTop:"10px"}}>
                           {userprofile.user.name}
                    </div>
                    <p className="ppn" 
                       style={{display:"flex"}}>
                        <i className="icons material-icons">
                            email
                        </i>&nbsp;
                        {userprofile.user.email}
                    </p>
                    <div 
                       style={{display:"flex",
                               justifyContent:"space-between",
                               width:"108%",
                               marginTop:"0px"}}>
                    <div 
                       style={{fontSize:"25px"}}>
                           {userprofile.posts.length}&nbsp;
                           <p className="follow">
                               posts
                           </p> 
                    </div>
                    <div 
                        style={{fontSize:"25px"}}>
                            {userprofile.user.followers.length}&nbsp;
                            <p data-target="hello" 
                               className=" modal-trigger follow">
                                followers
                            </p> 
                    </div>
                    <div 
                        style={{fontSize:"25px"}}>
                            {userprofile.user.following.length}&nbsp; 
                            <p  data-target="hi"  
                                className=" modal-trigger follow">
                                    following
                            </p>
                    </div>
                </div>
            </div>
        </div>
        <div 
            style={{borderBottom:"1px solid grey",
                    display:"flex",
                    justifyContent:"space-around"}}>
            {userprofile.user.followers.includes(state._id)?
            <div 
                style={{display:"flex",justifyContent:"space-around"}}>
                    <button 
                        style={{borderRadius:"8px",
                               marginBottom:"10px",
                               margin:"5px",
                               width:"200%"}} 
                        className="btn waves-effect waves-light #26a69a teal lighten-1" 
                        onClick={()=>unfollowUser()}>
                        unFollow
                    </button>
                    <Link to={`/privateChat/${userprofile.user.name}/${userprofile.user._id}`}>
                        <button 
                            style={{marginBottom:"10px",
                                    borderRadius:"8px",
                                    margin:"5px",
                                    width:"190%"}} 
                            className = "send btn waves-effect waves-light #26a69a teal lighten-1">
                                send message
                        </button>
                    </Link>
                </div> 
                 : <div  
                        style={{display:"flex",
                                justifyContent:"space-around"}}> 
                            <button  style={{width:"200%",
                                             borderRadius:"8px",
                                             marginBottom:"1px",
                                             margin:"5px"}} 
                                     className=" send btn waves-effect waves-light #26a69a teal lighten-1" 
                                     onClick={()=>followUser()}>
                                 Follow
                           </button>
                           <Link to={`/privateChat/${userprofile.user.name}/${userprofile.user._id}`}>
                               <button style={{width:"190%",
                                               margin:"5px",
                                               borderRadius:"8px",
                                               marginBottom:"10px"}} 
                                        className="send btn waves-effect waves-light #26a69a teal lighten-1">
                                            send message
                                </button>
                            </Link>
                        </div>}
                    </div>
            <div className="gallery">
                {
                    userprofile.posts.map(item=>{
                        return(
                            <img key={item._id} 
                                 style={{width:"30%",padding:"5px"}} 
                                 data-target="welcome"  
                                 className=" modal-trigger"  
                                 src={item.photo} alt={item.title}/>   
                                )
                            })
                        }
             </div>
        </div>}
            
 {/*........MODAL..........*/}

<div style={{color:"black"}} id="hi" className="modal" ref={u1}>
    <div className="modal-content">
      <h5>Following</h5>
    <ul class="collection">
            {follow?follow.user.following.map(item=>{ 
                console.log("st",state) 
                return(
            <Link  
               to={item._id !== state._id?"/profile/"+ item._id:"/profile"} 
               onClick={()=>{
               M.Modal.getInstance(u1.current).close()}} ><li class="collection-item avatar">
               <img style={{width:"52px",height:"52px",borderRadius:"190px",marginTop:"8px"}} src={item.pic}  alt="pic" class="circle"/>
               <span className="title">
                   <h6 style={{textAlign:"left",fontWeight:"bold",paddingLeft:"2px"}}>
                       {item.name}
                    </h6>
                </span>
            <span>{item.email}</span>
        </li></Link> 
        )}):""}  
       </ul>
    </div>
</div>
  {/* .........mODAL........... */}
  <div style={{color:"black"}} id="hello" className="modal" ref={u2}>
    <div className="modal-content">
      <h5>Followers</h5>
        <ul class="collection">
            {follow?follow.user.followers.map(item=>{ 
                return(
            <Link to={item._id !== state._id?"/profile/"+ item._id:"/profile"} 
                onClick={()=>{
            M.Modal.getInstance(u2.current).close()}} ><li class="collection-item avatar">
            <img style={{width:"52px",height:"52px",borderRadius:"190px",marginTop:"8px"}} src={item.pic}  alt="pic" class="circle"/>
            <span className="title"><h6 style={{textAlign:"left",fontWeight:"bold",paddingLeft:"2px"}}>{item.name}</h6></span>
            <span>{item.email}</span>
          </li></Link> 
         )}):""}  
       </ul>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
    </div>
</div>
  {/*..........MODAL.............*/}
  <div id="welcome" class="modal modalview" ref={u3}>
    <div class="modal-content">
      {userprofile?userprofile.posts.map(item=>{
          console.log("my",item)
          return(  
            <div className="" style={{width:"50%",height:"10%",backgroundSize:"cover"}} key={item._id}>
            <h5 className="Name" style={{fontWeight:"bold",padding:"9px"}}>
                <Link to={item.postedBy._id !== state._id?"/profile/"+ item.postedBy._id:"/profile"}>
                    <div style={{display:"flex",marginTop:"3px",width:"200%"}}>
                        <img 
                        style={{width:"30px",height:"30px",borderRadius:"160px"}} 
                        src={item.postedBy.pic}/>&nbsp;
                        {item.postedBy.name}
                        {item.postedBy._id === state._id}
                    </div>
                </Link>
            </h5>
             <div className="card-image" >
                <img style={{width:"200%",height:"330px"}}src={item.photo}>
                </img>
            </div>
            <div className="">
                {item.likes.includes(state._id)
                ?<div> <i className="icons material-icons" style={{color:"red"}}  
                    onClick={()=>unlikePost(item._id)}> favorite</i>
                </div>
                :<i className="icons material-icons" 
                    onClick={()=>likePost(item._id)}>favorite_border
                </i>}
               <h6 className="mark" >{item.likes.length}&nbsp;liked</h6>
                <h5 className="name" >{item.postedBy.name}&nbsp;<mark className="title">{item.title}</mark></h5>
               <p className="comment" onClick={()=>toogle()}>view&nbsp;<mark>{item.comments.length}</mark>&nbsp;comments</p>
                <div>{item.comments.map(record=>{
                       console.log("home",record)
                       return(
                        <>
                        {show?<h6 className="com" key={record._id}><span style={{fontWeight:"bold"}}>{item.postedBy.name}&nbsp;</span>{record.text}</h6>:""}
                        </>
                        )
                    })} </div>
               <form onSubmit={(e)=>{
                   e.preventDefault()
                postComment(e.target[0].value,item._id)
               }}>
               <input type="text"  placeholder={`add comment as ${state.name}...`} ></input>
               </form>
            </div>
        </div>
          )
     }):""} 
    </div>
  </div>
</div>
    )
}

export default UserProfile