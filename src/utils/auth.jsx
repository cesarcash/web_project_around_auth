import { configHeaders, url, BASE_URL } from "./constants";
import { getToken } from "./token";

class Api {

    constructor({headers,url}){
        this._headers = headers;
        this._url = url;
    }

    async _makeRequest(endpoint,method = 'GET', body = null){

        const options = {
            method,
            headers: {...this._headers}
        }

        // const token = getToken();
        // if(token){
        //     options.headers['Authorization'] = `Bearer ${token}`;
        // }

        if(body){
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }

        try {
            
            const res = await fetch(`${this._url}${endpoint}`, options);
            if(!res.ok) throw new Error(`Server error: ${res.status}`);
            return await res.json();

        }catch(error){
            console.error(`Server error: ${error}`);
            throw error;
        }

    }

    signup(data){
        return this._makeRequest('/signup','POST',data)
    }

    signin(data){
        return this._makeRequest('/signin','POST',data)
    }

    getUserInfo(){
        return this._makeRequest('/users/me',)
    }

}

const auth = new Api({
    headers: {
        type: configHeaders.type
    },
    url
})

export default auth;

// export const signup = (email, password) => { //registro

//     return fetch(`${url}/signup`, {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({email, password})
//     })
//     .then((res) => {
//         return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
//     })

// }

// export const signin = (email, password) => { //login

//     return fetch(`${url}/signin`, {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({email, password})
//     })
//     .then((res) => {
//         return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
//     })

// }

// export const getUserInfo = (jwt) => {

//     return fetch(`${url}/users/me`, {
//         method: 'GET',
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwt}`
//         },
//     })
//     .then((res) => {
//         return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
//     })

// }