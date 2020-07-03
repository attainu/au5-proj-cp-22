import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup =()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
    const [show,showPass] = useState("password")
    useEffect(()=>{
        if(url){
            uploadfields()
        }

    },[url])

const uploadPic = ()=>{
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
const uploadfields=()=>{
    if(!/^(?=.*[a-z][a-z\-0-9])(?=.)(?=.{4,})/.test(name)){
        M.toast({html: 'username can contain mininum 4 characters,special characters,numbers,alphabets',classes:"#b71c1c red darken-4"})
        return
    }
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: 'invalid email',classes:"#b71c1c red darken-4"})
        return
    }
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/.test(password)){
        M.toast({html: 'password must contain minimum 4 characters , special character ,Number and Capital letter',classes:"#b71c1c red darken-4"})
        return
    }
    fetch("/signup",{
        method:"post",
        headers:{
            "content-Type":"application/json"
        },
        body:JSON.stringify({
            name,
            email,
            password,
            pic:url
        })
    }).then(res=>res.json())
    .then(data=>{
        if(data.errMessage){
            M.toast({html: 'email already exist',classes:"#b71c1c red darken-4"})
         }
        if(data.error){
            M.toast({html: 'Please enter all the fields',classes:"#b71c1c red darken-4"})
        }
        else{
            M.toast({html:data.message,classes:"#43a047 green darken-1"})
            history.push('/login')
        }
       
    }).catch(err=>{
        console.log(err)
        // M.toast({html: 'email already exists',classes:"#b71c1c red darken-4"})
    })


}

const PostData =()=>{
    
    if(image){
        
        uploadPic();
        
        
    }
    else{
        uploadfields()
        
    }

}

const pass=()=>{
    showPass(!show)
}


    return(
      <div className="mycard">
        <div  className="card auth-card input-field">
            <h2>Appogram</h2>
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
            <input type={show? "password":"text"}
            placeholder="password"
            value ={password}
            onChange = {(e)=>setPassword(e.target.value)}
            />
             <p>
             <label className="showP">
             <input type="checkbox" onClick={() => pass()} />
             <span>Show password</span>
             </label>
             </p>
            <div className="signup file-field input-field">
                <div className="btn waves-effect waves-light #d81b60 blue darken-1">
                  <span>Upload pic</span>
                  <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #d81b60 pink darken-1"
            onClick = {()=>PostData()} disabled={!email || !name || !password }>
                Signup
    
            </button> 
           
            
            <p>
               Already have an account?&nbsp;&nbsp;
                <Link to="/login"><mark>Login</mark></Link>
            </p>

        
        </div>
      </div>
    )

}

export default Signup