import React,{useState,useEffect,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import {useParams} from 'react-router-dom'
import M from 'materialize-css'

const Update =()=>{
    const history = useHistory()
    const {userid} = useParams()
    const {state,dispatch} = useContext(UserContext)
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
    const [data,setData] = useState([])
   
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
              fetch(`/updatePic/${userid}`,{
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
const uploadfields=()=>{
    
    fetch(`/updateProfile/${userid}`,{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            name,
            email
        })
    }).then(res=>res.json())
    .then(data=>{
        console.log("update",data)
        if(data.error){
            M.toast({html:'email already exists',classes:"#b71c1c red darken-4 "})
        }
        else{
            // M.toast({html:data.message,classes:"#43a047 green darken-1"})
            
            dispatch({type:"UPDATE_PROFILE",payload:{name:data.name,email:data.email}})
            localStorage.setItem("user",JSON.stringify(data))
            console.log("up data",data)
            M.toast({html:"profile updated successfully!!",classes:"#43a047 green darken-1"})

            history.push('/profile')
    
        }
       
    }).catch(err=>{
        console.log(err)
        // M.toast({html:data.error,classes:"#b71c1c red darken-4"})
    })
}
const PostData =()=>{
    if(image){
        return(
        updatePhoto(),
        uploadfields()
        )
    }
    else{
        uploadfields()
    }

}

    return(
      <div className="mycard">
          <h2>Edit profile</h2>
        <div className="card auth-card input-field">
            {/* <h2>Update profile</h2> */}
            <input type="text"
            placeholder="username"
            value ={name}
            onChange = {(e)=>setName(e.target.value)}
            />
            <input type="text"
            placeholder="email"
            value ={email}
            onChange = {(e)=>setEmail(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #d81b60 blue darken-1">
                  <span>Upload pic</span>
                  <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #26a69a teal lighten-1"
            onClick = {()=>PostData()} disabled={!name||!email}>
                Update
            </button>
        
        </div>
      </div>
    )

}

export default Update