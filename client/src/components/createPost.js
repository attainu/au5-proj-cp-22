import React,{useState,useEffect} from "react"
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'

const CreatePost =()=>{
    const history = useHistory()
    const[title,setTitle] = useState("")
    const[image,setImage] = useState("")
    const[url,setUrl] = useState("")
    //callback
    useEffect(()=>{
        if(url){
            
        fetch("/createpost",{
            method:"post",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
               title,
            //    body,
               pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
               M.toast({html: 'error in creation',classes:"#b71c1c red darken-4"})
            }
            else{
                M.toast({html:"post created successfully",classes:"#43a047 green darken-1"})
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
        }

    },[url])

    const postDetails = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","Appogram")
        data.append("cloud_name","dpad3bwv8")

        fetch("https://api.cloudinary.com/v1_1/dpad3bwv8/image/upload",{
            method:"POST",
            body:data
        }).then(res =>res.json())
        .then(data=>{
            // console.log(data)
            setUrl(data.url)
        }).catch(err=>{
            console.log(err)
        })

    
    }
    
    return(
        <div className="mycard2  input-filed create" style={{margin:"30px auto",maxWidth:"500px",padding:"20px",textAlign:"center",marginTop:"150px"}}>
            <h2>Create post</h2>
            <input type="text" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #d81b60 blue darken-1">
                  <span>File</span>
                  <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #26a69a teal lighten-1" onClick={()=>postDetails()} disabled={!title||!image}>
                Submit
            </button>

        </div>
    )

}
export default CreatePost