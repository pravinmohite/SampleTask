const endPoint="https://jsonplaceholder.typicode.com/users";
export function test () {
    console.log('hello from api service');
}
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