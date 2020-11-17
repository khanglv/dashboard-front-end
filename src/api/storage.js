export const accessTokenAuth = ()=>{
    return localStorage.getItem('accessTokenAuthKey');
}

//token api core
export const accessTokenCore = ()=>{
    return localStorage.getItem('accessTokenCore');
}

//remember section order
export const rememberSectionOrder = (obj)=>{
    return localStorage.setItem('rememberSectionOrder', obj);
}

export const removeSectionOrder = ()=>{
    return localStorage.removeItem('rememberSectionOrder');
}
//remember order quick
export const rememberOrderQuick = (obj)=>{
    return localStorage.setItem('rememberOrderQuick', obj);
}
export const removeOrderQuick = ()=>{
    return localStorage.removeItem('rememberOrderQuick');
}

//remember quantity suggestion
export const rememberQuantitySuggestion = (obj)=>{
    return localStorage.setItem('rememberQuantitySuggestion', obj);
}
export const removeQuantitySuggestion = ()=>{
    return localStorage.removeItem('rememberQuantitySuggestion');
}

//remember section order
export const rememberTypeOfOrder = (obj)=>{
    return localStorage.setItem('rememberTypeOfOrder', obj);
}
export const removeTypeOfOrder = ()=>{
    return localStorage.removeItem('rememberTypeOfOrder');
}

export const removeStorageToken = ()=>{
    localStorage.removeItem('accessTokenAuthKey');
    localStorage.removeItem("accountInfoKey");
    localStorage.removeItem("accessTokenCore");
    localStorage.removeItem("userInfoKey");
    return '';
}