const API_URL = 'https://ogerpowvy5.execute-api.us-east-1.amazonaws.com/prod';

export const loginUser = async ({ email, password }: { email: string, password: string }) => {
    let success = false;
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data?.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('savedEmail', email);
            success = true;
        }
    }
    catch (err) {
        console.log(err);
        success = false;
    }
    return success;
}
export const getStates = async () => {
    try {
        const res = await fetch(`${API_URL}/states`);
        return await res.json();
    }
    catch (err) {
        console.log(err);
    }
}