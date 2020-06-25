import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../App'
import {Link} from 'react-router-dom'

const Home =()=>{
    const [data,setData] = useState([])
    const [show,setShow] = useState(false)
    const {state,dispatch} =useContext(UserContext)
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
const deletecomment = (postId) =>{
    fetch(`/deletecomment/${postId}`,{
        method:"delete",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result =>{
        console.log(result)
        const newDataComment = data.filter(item=>{
            return item._id !== result._id
        })
        setData(newDataComment)
    }).catch(err=>{
        console.log(err)
    })
}

const toogle=()=>{
    setShow(!show)
}
    return(
        <>
        {!data?
        <div className="home">
           
            {
                data.map(item =>{
                    return(
                        <div className="card home-card" key={item._id}>
                        <h5 style={{fontWeight:"bold"}}>
                            <Link to={item.postedBy._id !== state._id?"/profile/"+ item.postedBy._id:"/profile"}> 
                            <img 
                                    style={{width:"30px",height:"30px",borderRadius:"160px"}} 
                                    src={item.postedBy.pic}/>&nbsp;{item.postedBy.name}</Link> 
                                    {item.postedBy._id === state._id && <i className="material-icons" style={{float:"right"}} 
                                    onClick={()=>deletepost(item._id)}>delete</i>
                        }</h5>
                        <div className="card-image">
                            <img src={item.photo}>
                            </img>
                        </div>
                        <div className="card-content">
                            {item.likes.includes(state._id)
                            ?<div> <i className="material-icons" style={{color:"red"}}  onClick={()=>unlikePost(item._id)}> favorite</i></div>
                            :<i className="material-icons" onClick={()=>likePost(item._id)}>favorite_border</i>}
                           <h6 className="mark">{item.likes.length}&nbsp;liked</h6>
                           <h5 className="name">{item.postedBy.name} &nbsp;<mark className="title">{item.title}</mark></h5>
                           <p className="comment" onClick={()=>toogle()}>view&nbsp;<mark>{item.comments.length}</mark>&nbsp;comments</p> 
                           {show?<div>
                           {
                               item.comments.map(record=>{
                                   console.log("follow",record)
                                   return(
                                    <h6 key={record._id}><span style={{fontWeight:"bold"}}> <Link to={record.postedBy._id !== state._id?"/profile/"+ record.postedBy._id:"/profile"}> {record.postedBy.name}</Link></span>&nbsp;&nbsp;{record.text} {record.postedBy._id === state._id && <i className="material-icons" style={{float:"right"}} onClick={()=>deletecomment(record.postedBy._id)}>delete</i>}</h6>
                                   )
                               })
                           }</div>:""}
                           <form onSubmit={(e)=>{
                               e.preventDefault()
                            //    console.log(e.target[0].value)
                            postComment(e.target[0].value,item._id)
                           }}>
                           <input type="text"  placeholder="add comment"></input>
                           </form>
                        </div>
                   </div>

                    )
                })
               
            }
             
           
           
           
      </div>
      :<div className="noPost">no post found...</div>}
      </>
    )
   
}

export default Home