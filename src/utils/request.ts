const request = ({
    url,
    method = "post",
    data,
    headers = {},
    onprogress
  }:{
    url:string,
    method?: "post" | "get"
    data?:any ,
    headers?: {[x:string]:string},
    onprogress: ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any) | null
  })=>{
    return new Promise(resolve=>{
        const xhr = new XMLHttpRequest();
        xhr.open(method , url);
        Object.keys(headers).forEach(key=>{
            xhr.setRequestHeader(key , headers[key])
        })  
        xhr.upload.onprogress = onprogress;
        xhr.send(data);
        xhr.onload = (e)=>{
            resolve({
                data:e
            })
        }
    })
}
export default request;