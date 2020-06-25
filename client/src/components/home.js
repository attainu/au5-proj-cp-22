import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../App'
import {Link} from 'react-router-dom'

const Home =()=>{
    const [data,setData] = useState([])
    const [show,setShow] = useState(false)
    const {state,dispatch} =useContext(UserContext)
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
        <div className="home">
            {
                data.map(item =>{
                    console.log("pic",data)
                    return(
                        <div className="card home-card" key={item._id}>
                        <h5 className="Name" style={{fontWeight:"bold",padding:"9px"}}>
                            <Link to={item.postedBy._id !== state._id?"/profile/"+ item.postedBy._id:"/profile"}>
                                <div style={{display:"flex",marginTop:"3px"}}>
                                    <img 
                                    style={{width:"30px",height:"30px",borderRadius:"160px"}} 
                                    src={item.postedBy.pic}/>&nbsp;
                                    {item.postedBy.name}
                                </div>
                                
                            </Link>{item.postedBy._id === state._id && <i className="material-icons" 
                            style={{float:"right",marginTop:"2px"}} 
                            onClick={()=>deletepost(item._id)}>
                            delete
                            </i>
                            
                            
                        }</h5>
                        <div className="card-image">
                            <img src={item.photo}>
                            </img>
                        </div>
                        <div className="card-content">
                            {item.likes.includes(state._id)
                            ?<div> <i className="material-icons" style={{color:"red"}}  
                                onClick={()=>unlikePost(item._id)}> favorite</i>
                            </div>
                            :<i className="material-icons" 
                                onClick={()=>likePost(item._id)}>favorite_border
                            </i>}
                           <h6 className="mark">{item.likes.length}&nbsp;liked</h6>
                           <h5 className="name">{item.postedBy.name} &nbsp;<mark className="title">{item.title}</mark></h5>
                           {/* <p>{item.body}</p> */}
                            <p className="comment" onClick={()=>toogle()}>view&nbsp;<mark>{item.comments.length}</mark>&nbsp;comments</p>
                           {show?<div>{item.comments.map(record=>{
                                   console.log("home",record)
                                   return(
                                   <h6 className="com" key={record._id}><span style={{fontWeight:"bold"}}>{state.name}&nbsp;</span>{record.text}</h6>
                                   )
                               
                           })} </div>:""}
                           
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
    )

}

export default Home