import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../App'
import Spinner from 'reactjs-simple-spinner'
import {Link} from 'react-router-dom'

const Home =()=>{
    const [data,setData] = useState([])
    const [show,setShow] = useState(false)
    const {state,dispatch} =useContext(UserContext)
    const [user,setUsers] = useState([])
    useEffect(()=>{
       fetch("/allpostsofFollowing",{
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
        const newData = data.filter(item=>{
            return item._id !==result._id
        })
        setData(newData)
    })
}
const toogle=()=>{
    setShow(!show)
}

useEffect(()=>{
    fetch("/following",{
        methos:"get",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res =>res.json())
    .then(result=>{
        console.log("u",result)
        setUsers(result.user) 
    })
    
 },[])
    return(
        // <div className="noPost">no post found...<div> <Link to="/explore" className="page">explore and follow people to see their posts</Link></div></div>
        <div className="home1">
        <div className="home">
      
    
           <>
           {data.length===0?<div className="noPost">no post found...<div> <Link to="/explore" className="page">explore and follow people to see their posts</Link></div></div>:
            data.map(item =>{
                
                    return(
                        
                        <div className="card home-card" key={item._id}>
                           
                        <h5 style={{fontWeight:"bold",padding:"9px"}}>
                            <Link to={item.postedBy._id !== state._id?"/profile/"+ item.postedBy._id:"/profile"}> 
                            <div style={{display:"flex",marginTop:"3px",margin:"6px"}}>
                            <img 
                            style={{width:"34px",height:"34px",borderRadius:"160px"}}  
                            src={item.postedBy.pic}/>&nbsp;{item.postedBy.name}
                            {item.postedBy._id === state._id && <i  className="icons material-icons" 
                            style={{float:"right"}} 
                            onClick={()=>deletepost(item._id)}>
                            delete
                            </i>}
                            </div>
                           </Link> 
                                   
                        </h5>
                        <div className="card-image">
                            <img className="postI" src={item.photo}>
                            </img>
                        </div>
                        <div className="card-content">
                            {item.likes.includes(state._id)
                            ?<div> <i className="icons material-icons" style={{color:"red"}}  onClick={()=>unlikePost(item._id)}> favorite</i></div>
                            :<i className="icons material-icons" onClick={()=>likePost(item._id)}>favorite_border</i>}
                           <h6 className="mark">{item.likes.length}&nbsp;liked</h6>
                           <h5 className="name">{item.postedBy.name} &nbsp;<mark className="title">{item.title}</mark></h5>
                           <p className="comment" onClick={()=>toogle()}>view&nbsp;<mark>{item.comments.length}</mark>&nbsp;comments</p> 
                           {show?<div>
                           {
                               item.comments.map(record=>{
                                   console.log("follow",record)
                                   return(
                                    <h6 className="com" key={record._id}><span style={{fontWeight:"bold"}}>{record.postedBy.name}&nbsp;</span>{record.text}</h6>
                                   )
                               })
                           }</div>:""}
                           <form onSubmit={(e)=>{
                               e.preventDefault()
                            //    console.log(e.target[0].value)
                            postComment(e.target[0].value,item._id)
                           }}>
                           <input type="text"  placeholder={`add comment as ${state.name}...`}></input>
                           </form>
                        </div>
            
                   </div>
                        

                    )
                        
                })
            }
            
         </>    
        </div>
      <>
          
          <div class=" card1">
            <h5 class="header" style={{marginTop:"52px"}}>List of following</h5>
            {user.length===0?<Spinner size="big" lineSize={12} lineFgColor="#009999" fontSize={20} message="Loading..."  />:
            user.map(users=>{ return(
            <div class="card horizontal">
        
              <div class="card-image">
                <img style={{width:"60px",height:"60px",borderRadius:"160px",marginTop:"10px",marginLeft:"5px"}}  src={users.pic}/>
              </div>
              <Link to={users._id !== state._id?"/profile/"+ users._id:"/profile"}>
              <div class="card-stacked">
                <div class="card-content">
                  <p style={{fontWeight:"bold",textAlign:"left",marginTop:"0px"}}>{users.name}</p>
                </div>
              </div>
              </Link>
            
            </div>
            
         )
        })}
          </div>
          
        </>
        

      </div>
      
    )
   
}

export default Home