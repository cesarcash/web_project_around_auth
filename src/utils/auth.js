const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

export const signup = ({username, password}) => { //registro

    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })
    .then((res) => {
        return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
    })

}

export const signin = ({username, password}) => { //login

    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })
    .then((res) => {
        return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
    })

}