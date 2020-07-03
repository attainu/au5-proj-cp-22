import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../App'
import { Link } from 'react-router-dom'


const Profile =()=>{
    const [mypics,setPics] = useState([])
    const [image,setImage] = useState("")
    // const [url,setUrl] = useState(undefined)
    // const [userPost,setPost] = useState([])
    const {state,dispatch} = useContext(UserContext)
    console.log("state",state)
    useEffect(()=>{
    fetch('/myposts',{
    methos:"get",
    headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    }
}).then(res=>res.json())
.then(result=>{
    // console.log(result)
    setPics(result.mypost)
})

},[])

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
// <button ><Link to={state?"/updateProfile/"+ state._id:"/updateProfile"}>edit profile</Link></button>
    return(
       
        
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div style={{
           margin:"18px 0px",
            borderBottom:"1px solid grey"
        }}>

      
        <div style={{
            display:"flex",
            justifyContent:"space-around",
           
        }}>
            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px",borderColor:"black"}}
                src={state?state.pic:"loading"}
                />
              
            </div>
            <div>
                <h4>{state?state.name:"loading"}</h4>
                <p style={{display:"flex"}}><i className="material-icons">email</i>&nbsp;{state?state.email:"loading.."}</p>
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h5>{mypics.length}&nbsp;<mark className="follow">posts</mark> </h5>
                    <h5>{state?state.followers.length:"0"} <mark className="follow">followers</mark> </h5>
                    <h5>{state?state.following.length:"0"} <mark className="follow">following</mark> </h5>
                </div>

            </div>
        </div>
     
         <div style={{margin:"10px"}}>
         <button className="edit btn waves-effect waves-light #1e88e5 blue darken-1"><Link to={state?"/updateProfile/"+ state._id:"/updateProfile"}>edit profile</Link></button>
        </div>
         </div>
         {mypics.length===0?<h6 className="noPost">-no post yet-</h6>:
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return(
                    
                            <img key={item._id} className="item" src={item.photo}  alt={item.title}/>  
         
                        )
                    })
                }
              
              
            </div>}
           
        </div>
        
       
        
    )


}

export default Profile