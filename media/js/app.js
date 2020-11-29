import {test,getDetails} from './apiService.js'
const desktopElem=document.getElementById('table-body');
const mobileElem=document.getElementById('mobile-view-container');
let detailList;
let temporaryDetalList;
const metaDataElem=document.getElementById('meta-data-details');
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

getDetails().then(response=>{
    detailList=response;
    renderTableFromData(response);
    renderMetaData(response);
});

const renderForMobile=(data)=>{
    mobileElem.innerHTML="";
    for(let i=0;i<data.length;i++) {
       let elemToBeAppended="";   
       elemToBeAppended+="<div class='mobile-view-item'>";
       elemToBeAppended+="<div class='item'><span>Username: </span><span>"+data[i].username+"</span></div>"
       elemToBeAppended+="<div class='item'><span>Email: </span><span>"+data[i].email+"</span></div>"
       elemToBeAppended+="<div class='item'><span>City: </span><span>"+data[i].address.city+"</span></div>"
       elemToBeAppended+="</div>";
       mobileElem.innerHTML+=elemToBeAppended;
    }
}

const renderForDesktop=(data)=>{
    desktopElem.innerHTML="";
     for(let i=0;i<data.length;i++) {
        let elemToBeAppended="";   
        elemToBeAppended+="<tr>";
        elemToBeAppended+="<td>"+data[i].username+"</td>"
        elemToBeAppended+="<td>"+data[i].email+"</td>"
        elemToBeAppended+="<td>"+data[i].address.city+"</td>"
        elemToBeAppended+="</tr>";
        desktopElem.innerHTML+=elemToBeAppended;
     }
}

const renderTableFromData=(data)=> {
   if(isMobile) { 
    renderForMobile(data);
   }  
   else {
     renderForDesktop(data);
   }
}

const renderMetaData=(data)=>{
 metaDataElem.innerHTML+=JSON.stringify(data[0]);
}

const searchByUsernameEmail=(searchedString)=>{
    if(searchedString.trim()=="") {
        renderTableFromData(detailList)
    }
    else {
        temporaryDetalList=detailList.filter((item)=>{
        if(item.username.toUpperCase().indexOf(searchedString.toUpperCase())>-1 || item.email.toUpperCase().indexOf(searchedString.toUpperCase())>-1)
            return true;
        else
            return false;  
        })
        renderTableFromData(temporaryDetalList);
   }
}
const checkIfSortByEmail=(event)=>{
  if(event.target && (event.target.classList.contains('email')||event.target.value &&event.target.value.toLowerCase()=='email'))
    return true;
  return false;  
}
const checkIfSortByUsername=(event)=>{
  if(event.target &&(event.target.classList.contains('username') ||event.target.value && event.target.value.toLowerCase()=='username'))
    return true;
  return false;  
}
const sortByColumn=(event)=> {
    if(checkIfSortByUsername(event))
    {
        detailList.sort((a,b)=>{
            if(a.username>b.username) {
             return 1
            } 
            else if(a.username<b.username) {
             return -1;
            }
            return 0; 
        })
    }
    else if(checkIfSortByEmail(event)) {
        detailList.sort((a,b)=>{
            if(a.email>b.email) {
             return 1
            } 
            else if(a.email<b.email) {
             return -1;
            }
            return 0; 
        })
    }
    renderTableFromData(detailList);
}

//event listeners
let element=document.getElementById('table-header');
element.addEventListener('click',(event)=>{
  sortByColumn(event);
})

let searchInputElement=document.getElementById('searchInput')
searchInputElement.addEventListener('keyup',(event)=>{
    searchByUsernameEmail(event.target.value)
})

let selectBoxElement=document.getElementsByClassName('sort-by-selectbox')[0];
selectBoxElement.addEventListener('change',(event)=>{
    console.log(event); 
    sortByColumn(event)
})