import Cookie from 'js-cookie';

//change this api to change the link of API call for all files.
let API = 'http://157.230.43.112:3000';


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

export {API, convertToForm, getSession, saveSidebarState, getSidebarState}