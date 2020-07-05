import React,{useState,useEffect,useContext,useRef} from 'react'
import {UserContext} from '../App'
import Spinner from 'reactjs-simple-spinner'
import {Link,useParams} from 'react-router-dom'
import M from 'materialize-css'

const Home =()=>{
    const [data,setData] = useState([])
    const [show,setShow] = useState(false)
    const {state,dispatch} =useContext(UserContext)
    const [users,setUser] = useState([])
    const RecomModal = useRef(null)
    
    useEffect(()=>{
        M.Modal.init(RecomModal.current)
      },[])
  
    console.log("state",state)
    useEffect(()=>{
       fetch("/allposts",{
           methos:"get",
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res =>res.json())
       .then(result=>{
           console.log("post",result)
           setData(result.posts)
       })
    },[])
    useEffect(()=>{
        fetch("/recomendation",{
            methos:"get",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res =>res.json())
        .then(results=>{
            // results.users.slice(3,0)
            console.log("users",results)
            setUser(results.users)
            // console.log("new",newData)
        })
},[])

   
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
const deletepost = (postId) =>{
    fetch(`/deletepost/${postId}`,{
        method:"delete",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result =>{
        console.log(result)
        M.toast({html:"Deleted post successfully",classes:"#43a047 green darken-1"})
        const newData = data.filter(item=>{
            return item._id !==result._id
        })
        setData(newData)
    })
}

const toogle=()=>{
    setShow(!show)
}

   return(
        <div className="home1">
            <div className="home">
                <>
          
          <div class=" card2" >  
          <div  style={{marginTop:"52px",fontSize:"26px",color:"blue",marginRight:"90px"}} data-target="modal12"  className=" modal-trigger header"><h6> more Suggestions?</h6></div>
          {users?users.slice(2,).map(user=>{ return(
            <div className="card horizontal" >  
              <div clasNames="card-image">
                <img style={{width:"60px",height:"60px",borderRadius:"160px",marginTop:"15px",marginLeft:"5px"}}  src={user.pic} />
              </div>
              <Link to={user._id !== state._id?"/profile/"+ user._id:"/profile"}>
                <div class="card-content">
                  <p style={{fontWeight:"bold",textAlign:"left",marginTop:"0px"}}>{user.name} </p>
                  <h6 style={{textAlign:"left"}}>{user.email}</h6>
                </div>
              </Link>
            </div>
             )
            }):"loading...."}
          </div>  
        </>

        {data.length===0? <Spinner size="huge" lineSize={12} lineFgColor="#009999" fontSize={20} message="Loading posts..."  />:
                data.map(item =>{
                    console.log("pic",data)
                    return(
                        
                        <div className="card home-card" key={item._id}>
                        <h5 className="Name" style={{fontWeight:"bold",padding:"9px"}}>
                            <Link to={item.postedBy._id !== state._id?"/profile/"+ item.postedBy._id:"/profile"}>
                                <div style={{display:"flex",marginTop:"3px",margin:"6px"}}>
                                    <img 
                                    style={{width:"34px",height:"34px",borderRadius:"160px"}} 
                                    src={item.postedBy.pic}/>&nbsp;
                                    {item.postedBy.name}
                                    {item.postedBy._id === state._id && <i  className="gg icons material-icons" 
                            style={{marginLeft:"500px"}} 
                            onClick={()=>deletepost(item._id)}>
                            delete
                            </i>}
                                </div>
                                
                            </Link>
                        </h5>
                        <div className="">
                            <img className="postI" style={{width:"100%"}}src={item.photo}>
                            </img>
                        </div>
                        <div className="card-content">
                            {item.likes.includes(state._id)
                            ?<div> <i className="icons material-icons" style={{color:"red"}}  
                                onClick={()=>unlikePost(item._id)}> favorite</i>
                            </div>
                            :<i className="icons material-icons" 
                                onClick={()=>likePost(item._id)}>favorite_border
                            </i>}
                           <h6 className="mark">{item.likes.length}&nbsp;liked</h6>
                           <h5 className="name">{item.postedBy.name} &nbsp;<mark className="title">{item.title}</mark></h5>
                           {/* <p>{item.body}</p> */}
                           <p className="comment" onClick={()=>toogle()}>view&nbsp;<mark>{item.comments.length}</mark>&nbsp;comments</p>
                            <div>{item.comments.map(record=>{
                                   console.log("home",record)
                                   return(
                                    <div style={{width:"60%"}}>
                                    {show?<h6 className="com" key={record._id} style={{display:"flex"}}><span style={{fontWeight:"bold"}}>{record.postedBy.name}&nbsp;&nbsp;&nbsp;</span><p className="com" style={{overflowWrap:"break-word",width:"130%"}}>{record.text}</p></h6>:""}
                                    </div>
                           )
                        })} </div>
                           
                           <form onSubmit={(e)=>{
                               e.preventDefault()
                            //    console.log(e.target[0].value)
                            postComment(e.target[0].value,item._id)
                           }}>
                           <input type="text"  placeholder={`add comment as ${state.name}...`} ></input>
                           </form>
                           
                        </div>
                        
                   </div>
                  
                    )
                  
                })
            }
 </div>
 {/* ......suggestions code........... */}
 <>
 <div class="card1" >
    <div class="header" style={{marginTop:"32px",marginLeft:"0px",fontSize:"26px",display:"flex"}}>Suggestions for you<p data-target="modal12"  className=" modal-trigger" style={{marginLeft:"2%",color:"blue",marginTop:"10px"}}>See more</p></div>
  {users.length===0? <Spinner size="big" lineSize={12} lineFgColor="#009999" fontSize={20} message="Loading recomendations..."  />
  :users.map(user=>{ return(
    <div className="card horizontal" >  
      <div clasNames="card-image">
        <img style={{width:"60px",height:"60px",borderRadius:"160px",marginTop:"25px",marginLeft:"5px"}}  src={user.pic} />
      </div>
      <Link to={user._id !== state._id?"/profile/"+ user._id:"/profile"}>
      {/* <div class="card-stacked"> */}
        <div class="card-content">
          <p style={{fontWeight:"bold",textAlign:"left",marginTop:"0px"}}>{user.name} </p>
          <h6 style={{textAlign:"left"}}>{user.email}</h6>
        </div>
      {/* </div> */}
      </Link>
    </div>
     )
    })}

  </div>

  {/* ......modal......... */}
  <div style={{color:"black"}} id="modal12" className="modal" ref={RecomModal}>
    <div className="modal-content">
      <h5>Suggestions for you</h5>
   
    <ul class="collection">
            {users.map(item=>{ 
                 
                return(
            <Link to={item._id !== state._id?"/profile/"+ item._id:"/profile"} onClick={()=>{
            M.Modal.getInstance(RecomModal.current).close()}} ><li class="collection-item avatar">
            <img style={{width:"52px",height:"52px",borderRadius:"190px",marginTop:"8px"}} src={item.pic}  alt="pic" class="circle"/>
            <span className="title"><h6 style={{textAlign:"left",fontWeight:"bold",paddingLeft:"2px"}}>{item.name}</h6></span>
            <span>{item.email}</span>
          </li></Link> 
         )})}  
        
      </ul>
    </div>
    
  </div>
  
</>

 </div>
    
    )
}


export default Home