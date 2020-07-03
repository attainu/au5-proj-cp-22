import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../App'
import {useParams} from 'react-router-dom'



const Profile =()=>{
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [userprofile,setProfile] = useState(null)
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    

useEffect(()=>{
fetch(`/user/${userid}`,{
    methos:"get",
    headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    }
}).then(res=>res.json())
.then(result=>{
    
    setProfile(result)
    console.log("result",result)
}).catch(err=>{
    console.log(err)
})

},[])

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
        console.log(data)
        dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
        localStorage.setItem("user",JSON.stringify(data))
        
        setProfile((prevState)=>{

            const newFollower =  prevState.user.followers.filter(item=>item !== data._id)
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
    return(
        <>
        {userprofile?  
        
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{display:"flex",justifyContent:"space-around",margin:"18px 0px", borderBottom:"1px solid grey"}}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px",marginTop:"30px"}} src={userprofile.user.pic}/>
                </div>
                <div>
                    <h4>{userprofile.user.name}</h4>
                    <p style={{display:"flex"}}><i className="material-icons">email</i>&nbsp;{userprofile.user.email}</p>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%",marginTop:"0px"}}>
                    <h5>{userprofile.posts.length}&nbsp;<mark className="follow">posts</mark> </h5>
                    <h5>{userprofile.user.followers.length}&nbsp;<mark className="follow">followers</mark> </h5>
                    <h5>{userprofile.user.following.length}&nbsp; <mark className="follow">following</mark></h5>
                </div>
                {showfollow?
                 <button style={{margin:"10px",width:"100%",borderRadius:"10px"}} className="btn waves-effect waves-light #d81b60 blue darken-1" onClick={()=>followUser()}>
                 Follow
                  </button>
                  : <button style={{margin:"10px",width:"100%"}} className="btn waves-effect waves-light #d81b60 blue darken-1" onClick={()=>unfollowUser()}>
                  unFollow
                   </button>
                }
            </div>
                
            </div>
            <div className="gallery">
                {
                    userprofile.posts.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>   
                        )
                    })
                }
              
              
            </div>
        </div>
        
        
        :<h2 style={{color:"black",textAlign:"center",marginTop:"120px"}}>loading.....</h2>}
        
        </>
    )
// <h2 style={{color:"black",textAlign:"center",marginTop:"120px"}}>loading.....</h2>
}

export default Profile