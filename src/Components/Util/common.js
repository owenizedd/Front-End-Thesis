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


export {convertToForm, getSession}