import Cookie from 'js-cookie';




function convertToForm(formElement){
  var ret = new URLSearchParams();
  for (const pair of new FormData(formElement)) {

    ret.append(pair[0], pair[1]);
  }
  return ret;
}


function getSession(){
  if (Cookie.get('JWT_token')) return Cookie.get('JWT_token').length > 0;
  else return false;
}

function getSidebarState(){

  return localStorage.getItem('sidebarIndex') ? +localStorage.getItem('sidebarIndex') : 0 ;
}

function saveSidebarState(index){
  localStorage.setItem('sidebarIndex', index);
}
// let api = 'http://157.230.43.112:3000';

// async function getAPI(link){
//   let returnData = null ;
//   await fetch(`${api}/${link}`, {
//     headers: {
//       'authorization': Cookie.get('JWT_token')
//     }
//   })
//     .then(res => res.json())
//     .then(data => returnData = data.data.length)
//   console.log(returnData);
//   return ret;
//   }

// function getCompany(){
  
//   getAPI('api/office');

// }
export {convertToForm, getSession, saveSidebarState, getSidebarState}