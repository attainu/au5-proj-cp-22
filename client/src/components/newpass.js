import React,{useState,useContext, useEffect} from 'react'
import {Link,useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'
import FacebookLogin from 'react-facebook-login';
import axios from 'axios'
import {UserContext} from '../App'

const Login =()=>{
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [show,showPass] = useState("password")
    const {token} = useParams()
    console.log(token)
    const PostData =()=>{
       
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/.test(password)){
            M.toast({html: 'password must contain minimum 4 characters , special character ,Number and Capital letter',classes:"#b71c1c red darken-4"})
            return
        }
        fetch("/newPass",{
            method:"post",
            headers:{
                "content-Type":"application/json",
                // "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                token,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
               M.toast({html: 'Invalid email/password',classes:"#b71c1c red darken-4"})
            }
            else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                history.push('/login')
                window.location.reload(true)
            }
        }).catch(err=>{
            console.log(err)
        })
    
    }
const pass=()=>{
        showPass(!show)
}

    return(
       <div className="mycard">
        
        <div className="card auth-card input-field">
            <h2>Appogram</h2>
            <input type={show?"password":"text"}
            placeholder="enter new password"
            value ={password}
            onChange = {(e)=>setPassword(e.target.value)}
            />
            <p>
             <label style={{float:"left"}}>
             <input type="checkbox" onClick={()=>pass()} />
             <span>Show password</span>
             </label>
             </p>
             <button className="login btn waves-effect waves-light #26a69a teal lighten-1"
            onClick = {()=>PostData()} >
                update password
    
            </button>
        </div>
        
      </div>
     
    )

}

export default Login