import { configHeaders, BASE_URL } from "./constants";

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
        return this._makeRequest('/signup','POST',data) // registro
    }

    signin(data){
        return this._makeRequest('/signin','POST',data) // login
    }

    getUserInfo(){
        return this._makeRequest('/users/me',)
    }

}

const auth = new Api({
    headers: {
        accept: configHeaders.accept,
        type: configHeaders.type,
        authorization: configHeaders.token
    },
    url: BASE_URL
})

export default auth;