import { useEffect } from "react"

export default  function Test(){
    useEffect(()=>{
        console.log('init')
    },[])
    return (
        <div></div>
    )
}