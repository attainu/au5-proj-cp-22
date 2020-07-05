import React,{useEffect,useState,useContext,useRef} from 'react'
import {UserContext} from '../App'
import { Link } from 'react-router-dom'
import Spinner from 'reactjs-simple-spinner'
import M from 'materialize-css'

const Profile =()=>{
    const followingModal = useRef(null)
    const viewModal = useRef(null)
    const followerModal = useRef(null)
    const [mypics,setPics] = useState([])
    const [image,setImage] = useState("")
    const [data,setData] = useState([])
    const [show,setShow] = useState(false)
    const {state,dispatch} = useContext(UserContext)
    const [user,setUsers] = useState([])
    const [users,setUser] = useState([])
    console.log(state)
    useEffect(()=>{
        M.Modal.init(followingModal.current)
      },[])
      useEffect(()=>{
        M.Modal.init(followerModal.current)
      },[])
      useEffect(()=>{
        M.Modal.init(viewModal.current)
      },[])
    console.log("state",state)
    useEffect(()=>{
    fetch('/myposts',{
    methos:"get",
    headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    }
}).then(res=>res.json())
.then(result=>{
    console.log("mypics",result)
    setPics(result.mypost)
})

},[])

// cloudinary for file upload
useEffect(()=>{
  if(image){
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset","Appogram")
    data.append("cloud_name","dpad3bwv8")

    fetch("https://api.cloudinary.com/v1_1/dpad3bwv8/image/upload",{
        method:"POST",
        body:data
    }).then(res =>res.json())
    .then(data=>{
        fetch("/updatePic",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                pic:data.url
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
            dispatch({type:"UPDATE_PIC",payload:result.pic})
        })
        // window.location.reload()
    }).catch(err=>{
        console.log(err)
    })
  }
},[image])

const updatePhoto=(file)=>{
    setImage(file)
}
//api for following details
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
        // console.log("new",newData)
    })
},[])
//api for followers details
 useEffect(()=>{
    fetch("/followers",{
        methos:"get",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res =>res.json())
    .then(result=>{
        console.log("use",result)
        setUser(result.user)
        // console.log("new",newData)
    })
},[])
//api for like
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
//api for unlike 
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
//api for post comment
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
// api for delete post
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
//toggle for comment show and hide
const toogle=()=>{
    setShow(!show)
}
    return(
       <>
       
       <div  style={{maxWidth:"550px",margin:"0px auto",marginTop:"100px"}}>
        <div  style={{
           margin:"18px 0px",
            borderBottom:"1px solid grey"
        }}> 

        <div   style={{
            display:"flex",
            justifyContent:"space-around",
        }}>
            <div className="prof">
                <img className="imgg" style={{width:"170px",height:"170px",borderRadius:"90px",borderColor:"black",marginTop:"15px"}}
                src={state?state.pic:"loading"}
                />
              
            </div>
            <div >
                <div className="pname" style={{fontSize:"35px",marginTop:"10px"}}>{state?state.name:"loading"}</div>
                <p className="ppn" style={{display:"flex"}}><i className="icons material-icons">email</i>&nbsp;{state?state.email:"loading.."}</p>
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <div style={{fontSize:"25px"}}>{mypics.length}<p className="follow">posts</p> </div>
                    <div style={{fontSize:"25px"}}>{state?state.followers.length:"0"}<p data-target="modal11"  className="follow modal-trigger " >followers</p> </div>
                    <div style={{fontSize:"25px"}}>{state?state.following.length:"0"} <p data-target="modal10"  className="follow modal-trigger ">following</p> </div>
                </div>
{/*.......Modal.........  */}
<div style={{color:"black"}} id="modal10" className="modal" ref={followingModal}>
    <div className="modal-content">
      <h5>Following</h5>
   
    <ul class="collection">
            {user.map(item=>{ 
                console.log("st",state) 
                return(
            <Link  to={item._id !== state._id?"/profile/"+ item._id:"/profile"} onClick={()=>{
            M.Modal.getInstance(followingModal.current).close()}} ><li class="collection-item avatar">
            <img style={{width:"52px",height:"52px",borderRadius:"190px",marginTop:"8px"}} src={item.pic}  alt="pic" class="circle"/>
            <span className="title"><h6 style={{textAlign:"left",fontWeight:"bold",paddingLeft:"2px"}}>{item.name}</h6></span>
            <span>{item.email}</span>
          </li></Link> 
         )})}  
        
      </ul>
    </div>
    
  </div>
  {/* ...........modal............. */}
  <div style={{color:"black"}} id="modal11" className="modal" ref={followerModal}>
    <div className="modal-content">
      <h5>Followers</h5>
   
    <ul class="collection">
            {users.map(item=>{ 
                 
                return(
            <Link  to={item._id !== state._id?"/profile/"+ item._id:"/profile"} onClick={()=>{
            M.Modal.getInstance(followerModal.current).close()}} ><li class="collection-item avatar">
            <img style={{width:"52px",height:"52px",borderRadius:"190px",marginTop:"8px"}} src={item.pic}  alt="pic" class="circle"/>
            <span className="title"><h6 style={{textAlign:"left",fontWeight:"bold",paddingLeft:"2px"}}>{item.name}</h6></span>
            <span>{item.email}</span>
          </li></Link> 
         )})}  
        
      </ul>
    </div>
    
  </div>
  {/*  */}
         </div>
    </div>
     <div style={{margin:"10px"}}>
         <button className="edit btn waves-effect waves-light #26a69a teal lighten-1"><Link to={state?"/updateProfile/"+ state._id:"/updateProfile"}>edit profile</Link></button>
        </div>
         </div>

         {mypics.length===0?<h6 className="noPost">-no post yet-</h6>:
            <div className="gallery">
                {
                    mypics.map(item=>{
                        console.log("profile",item)
                        return(
                    //    <div className="pro card">
                       <img key={item._id} data-target="modal14" style={{width:"30%",padding:"5px"}}  className=" modal-trigger "  src={item.photo}   alt={item.title} onclick={()=>item._id}/>
                    //    </div>
                        )
                    })
                }
              
            </div>}
            {/*  */}
<div id="modal14" class="modal modalview" ref={viewModal}>
    <div class="modal-content">
      {mypics.map(item=>{
          console.log("my",mypics)
          return(
            // <div className="">
            <div className="" style={{width:"50%",height:"10%",backgroundSize:"cover"}} key={item._id}>
            <h5 className="Name" style={{fontWeight:"bold",padding:"9px"}}>
                <Link to={item.postedBy._id !== state._id?"/profile/"+ item.postedBy._id:"/profile"}>
                    <div style={{display:"flex",marginTop:"3px",width:"200%"}}>
                        <img 
                        style={{width:"30px",height:"30px",borderRadius:"160px"}} 
                        src={item.postedBy.pic}/>&nbsp;
                        {item.postedBy.name}
                        {item.postedBy._id === state._id && <i  className="icons material-icons" 
                style={{marginLeft:"10px",marginTop:"2px"}} 
                // marginLeft:"700px"
                onClick={()=>deletepost(item._id)}>
                delete
                </i>}
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
               {/* <p>{item.body}</p> */}
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
                //    console.log(e.target[0].value)
                postComment(e.target[0].value,item._id)
               }}>
               <input type="text"  placeholder={`add comment as ${state.name}...`} ></input>
               </form>
               
            </div>
      
         </div>
        //   </div>
          )
      
     })} 
     
    </div>
    
  </div>
   {/*  */}
  </div>

  </>
    )
}
    
          

export default Profile