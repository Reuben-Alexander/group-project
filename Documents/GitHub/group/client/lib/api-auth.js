import config from '../../config/config.js';

const signin = async (user) => { 
    try {
        let response = await fetch(`${config.apiBaseUrl}/auth/signin/`, { 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            credentials: 'include', 
            body: JSON.stringify(user)
        });
        return await response.json(); 
    } catch(err) {
        console.log(err); 
    }
}

const signout = async () => { 
    try {
        let response = await fetch(`${config.apiBaseUrl}/auth/signout/`, { 
            method: 'GET',
            credentials: 'include' // 确保包括凭据以便正确注销
        });
        return await response.json();
    } catch(err) { 
        console.log(err);
    } 
}

export { signin, signout };
