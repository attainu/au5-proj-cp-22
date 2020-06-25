export const initialState = null


export const reducer = (state,action)=>{
    if(action.type === "USER"){
        return action.payload
    }
    if(action.type === "CLEAR"){
        return null
    }
    if(action.type === "UPDATE"){
        return {
            ...state,
            followers:action.payload.followers,
            following:action.payload.following
        }
    }
    if(action.type=== "UPDATE_PIC"){
        return{
            ...state,
            pic:action.payload
        }
    }
    if(action.type === "UPDATE_PROFILE"){
        return {
            ...state,
            name:action.payload.name,
            email:action.payload.email
        }
    }
    return state
}