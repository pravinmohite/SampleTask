import {getDetails} from './apiService.js'
const desktopElem=document.getElementById('desktop-view-container');
const mobileElem=document.getElementById('mobile-view-container');
let detailList;
let temporaryDetalList;
const metaDataElem=document.getElementById('meta-data-details');
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const maxMobileWidth=768;

getDetails().then(response=>{
    detailList=response;
    renderTableFromData(response);
    renderMetaData(response);
});

const renderForMobile=(data)=>{
    mobileElem.innerHTML="";
    for(let i=0;i<data.length;i++) {
       let div=document.createElement('div');
       div.className="mobile-view-item";
       let divUsername=document.createElement('div');
       divUsername.className="item";
       let spanUsernameFirst=document.createElement('span');
       spanUsernameFirst.textContent="Username: ";
       let spanUsernameSecond=document.createElement('span');
       spanUsernameSecond.textContent=data[i].username;
       divUsername.append(spanUsernameFirst,spanUsernameSecond);
       let divEmail=document.createElement('div');
       divEmail.className="item";
       let spanEmailFirst=document.createElement('span');
       spanEmailFirst.textContent="Email: ";
       let spanEmailSecond=document.createElement('span');
       spanEmailSecond.textContent=data[i].email;
       divEmail.append(spanEmailFirst,spanEmailSecond);
       let divCity=document.createElement('div');
       divCity.className="item";
       let spanCityFirst=document.createElement('span');
       spanCityFirst.textContent="City: ";
       let spanCitySecond=document.createElement('span');
       spanCitySecond.textContent=data[i].address.city;
       divCity.append(spanCityFirst,spanCitySecond);
       div.append(divUsername,divEmail,divCity);
       mobileElem.append(div);
    }
}

const listenToTableHeaderClick=()=>{
    let element=document.getElementById('table-header');
    element.addEventListener('click',(event)=>{
      sortByColumn(event);
    })
}

const renderForDesktop=(data)=>{
    desktopElem.textContent="";
    let thead=document.createElement('thead');
    thead.setAttribute('id','table-header');
    let tr=document.createElement('tr');
    let thUsername=document.createElement('th');
    thUsername.setAttribute('class','username');
    thUsername.textContent='Username';
    let thEmail=document.createElement('th');
    thEmail.setAttribute('class','email');
    thEmail.textContent='Email';
    let thCity=document.createElement('th');
    thCity.removeAttribute('class');
    thCity.textContent='City';
    tr.append(thUsername,thEmail,thCity);
    thead.append(tr);
    desktopElem.appendChild(thead);
    let tbody=document.createElement('tbody');
    tbody.setAttribute('id','table-body');
    for(let i=0;i<data.length;i++) {
        let tr=document.createElement('tr');
        let tdUsername=document.createElement('td');
        tdUsername.textContent=data[i].username;
        let tdEmail=document.createElement('td');
        tdEmail.textContent=data[i].email;
        let tdCity=document.createElement('td');
        tdCity.textContent=data[i].address.city;
        tr.append(tdUsername,tdEmail,tdCity);
        tbody.append(tr);
    }
    desktopElem.append(tbody);
    listenToTableHeaderClick();
}

const renderTableFromData=(data)=> {
   if(window.innerWidth>maxMobileWidth) { 
    renderForDesktop(data);
   }  
   else {
     renderForMobile(data);
   }
}

const flatten=(obj,result={})=>{
    for(let item in obj) {
        if(typeof obj[item]=="object") {
            flatten(obj[item],result);
        }
        else {
            result[item]=obj[item];
        }
    }
    return result;
}

const renderMetaData=(data)=>{
    let metaDataObject=flatten(data[0]);
    for(let item in metaDataObject) {
        let div=document.createElement('div');
        div.className="meta-data-item";
        let spanFirst=document.createElement('span');
        spanFirst.textContent=item;
        let spanSecond=document.createElement('span');
        spanSecond.textContent=": "+metaDataObject[item]
        div.append(spanFirst,spanSecond);
        metaDataElem.append(div)
    }
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
const registerEventListeners=()=>{
    let searchInputElement=document.getElementById('searchInput')
    searchInputElement.addEventListener('keyup',(event)=>{
        searchByUsernameEmail(event.target.value)
    })
    
    let selectBoxElement=document.getElementsByClassName('sort-by-selectbox')[0];
    selectBoxElement.addEventListener('change',(event)=>{
        sortByColumn(event)
    })

    window.addEventListener('resize',()=>{
      renderTableFromData(detailList);
    })
}
registerEventListeners();