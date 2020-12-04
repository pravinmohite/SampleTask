const endPoint="https://jsonplaceholder.typicode.com/users";

export const getDetails=async ()=>{
    let response =await fetch(endPoint);
    if(response.ok) {
        let json=await response.json();
        return json;
    }
    else {
        console.error("HTTP error:"+response.status);
    }
}