import { useEffect } from "react";
import { useParams  } from "react-router-dom"

export default function Project(){
    const router = useParams();
    useEffect(()=>{
        console.log(router)
    },[])
    return <div>project</div>
}