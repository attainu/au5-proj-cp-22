import React,{useState,useContext, useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
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
    const PostData =()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: 'invalid email',classes:"#b71c1c red darken-4"})
            return
        }
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/.test(password)){
            M.toast({html: 'password must contain minimum 4 characters , special character ,Number and Capital letter',classes:"#b71c1c red darken-4"})
            return
        }
        fetch("/login",{
            method:"post",
            headers:{
                "content-Type":"application/json",
                // "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
               M.toast({html: 'Invalid email/password',classes:"#b71c1c red darken-4"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:"data.user"})
                M.toast({html:"signed in successfully",classes:"#43a047 green darken-1"})
                history.push('/')
                window.location.reload(true)
            }
        }).catch(err=>{
            console.log(err)
        })
    
    }
    

    const responseFacebook=(response)=>{
        console.log(response)
        axios({
            method:"post",
            url:"http://localhost:5000/facebookLogin",
            data:{accessToken:response.accessToken,userID:response.userID}
        }).then(response =>{
            localStorage.setItem("jwt",response.data.token)
            localStorage.setItem("user",JSON.stringify(response.data.user))
            dispatch({type:"USER",payload:"response.data.user"})
            console.log("facebook login success",response)
            M.toast({html:"signed in successfully",classes:"#43a047 green darken-1"})
                history.push('/')
                window.location.reload(true)

        }).catch(error => {
            console.log(error.response)
        });
    }

    const pass=()=>{
        showPass(!show)
    }


    return(

   
       
      <div className="mycard">
        
          <div id="fb-root"></div>
       <script async defer crossorigin="anonymous"  style={{marginLeft:"30px"}} src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v7.0&appId=1180841995600946&autoLogAppEvents=1" nonce="PDmfefqu"></script>
       
    
        
        <div className="card auth-card input-field">
       

            <h2>Appogram</h2>
            
            <input type="text"
            placeholder="email"
            value ={email}
            onChange = {(e)=>setEmail(e.target.value)}
            />
            <input type={show?"password":"text"}
            placeholder="password"
            value ={password}
            onChange = {(e)=>setPassword(e.target.value)}
            
           />
            <p>
             <label style={{float:"left"}}>
             <input type="checkbox" onClick={()=>pass()} />
             <span>Show password</span>
             </label>
             </p>
             <button className="login btn waves-effect waves-light #3949ab indigo darken-1"
            onClick = {()=>PostData()} disabled={!email  || !password }>
                Login
    
            </button>
            <p>
                Dont have an account?&nbsp;&nbsp;
                <Link to="/signup"><mark>Signup</mark></Link>
            </p>
            <p>
                {/* Dont have an account?&nbsp;&nbsp; */}
                <Link to="/reset"><mark>forgot password?</mark></Link>
            </p>
            
            <p className="hh">or</p>
            <FacebookLogin
             appId="1180841995600946"
             autoLoad={false}
             icon="fa fa-facebook-square"  
             cssClass=" my-facebook-button-class"
             callback={responseFacebook}
             
             />
            
             {/* <div class="fb-login-button" data-size="medium" data-button-type="login_with" data-layout="rounded" data-auto-logout-link="false" data-use-continue-as="true" data-width=""></div> */}
  
        
        </div>
        
      </div>
     
    )

}

export default Login