import React,{useState, useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'


const Reset =()=>{
    
    const history = useHistory()
    const [email,setEmail] = useState("")
    const PostData =()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: 'invalid email',classes:"#b71c1c red darken-4"})
            return
        }
        fetch("/resetPassword",{
            method:"post",
            headers:{
                "content-Type":"application/json",
                // "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                email,
                
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log("kkk",data)
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

    return(
       <div className="mycard">
       <div className="card auth-card input-field">
            <h2>Reset password</h2>
            <input type="text"
            placeholder="email"
            value ={email}
            onChange = {(e)=>setEmail(e.target.value)}
            />
            <button className="login btn waves-effect waves-light #26a69a teal lighten-1"
            onClick = {()=>PostData()} >
                Send Mail
            </button>
            <p>
                Dont have an account?&nbsp;&nbsp;
                <Link to="/signup"><mark>Signup</mark></Link>
            </p>
        </div>
    </div>
     
    )
}

export default Reset