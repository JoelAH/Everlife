import { GameState } from "../game/types";

const API_URL = 'https://l1vsxl9r5b.execute-api.us-east-1.amazonaws.com/prod';
export const FILE_URL = 'https://everlife-speech.s3.us-east-1.amazonaws.com'

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
            localStorage.setItem('refresh', data.refreshToken);
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

export const getSavedState = async () => {
    if (!localStorage.getItem('token')) return;
    try {
        const res = await getFetch();
        if (res.status === 401) {
            // renew token
            const refreshRes = await refreshFetch();
            const data = await refreshRes.json();
            if (data?.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refresh', data.refreshToken);
            }
            //try again
            const res = await getFetch();
            return await res.json();
        } else {
            return await res.json();
        }
    }
    catch (err) {
        console.log(err);
        try {
            const refreshRes = await refreshFetch();
            const data = await refreshRes.json();
            if (data?.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refresh', data.refreshToken);
            }
            //try again
            const res = await getFetch();
            return await res.json();
        }
        catch (err) {
            console.log(err);
        }
    }
}

export const savedData = async (state: GameState, allStates: GameState[]) => {
    if (!localStorage.getItem('token')) return;
    if (state.step && state.step <= 1) return;
    const theState = allStates.find(s => s.step === state.step);
    const savedState = {
        ...state,
        messages: theState?.messages || state.messages
    }
    try {
        const res = await saveFetch(savedState);
        if (res.status === 401) {
            // renew token
            const refreshRes = await refreshFetch();
            const data = await refreshRes.json();
            if (data?.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refresh', data.refreshToken);
            }
            //try again
            const res = await saveFetch(savedState)
            return await res.json();
        } else {
            return await res.json();
        }
    }
    catch (err) {
        console.log(err);
        try {
            const refreshRes = await refreshFetch();
            const data = await refreshRes.json();
            if (data?.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refresh', data.refreshToken);
            }
            //try again
            const res = await saveFetch(savedState)
            return await res.json();
        }
        catch (err) {
            console.log(err);
        }
    }
}
const saveFetch = async (state: GameState) => {
    return await fetch(`${API_URL}/save-state`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(state)
    });
}

const getFetch = async () => {
    return await fetch(`${API_URL}/get-state`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
    });
}

const refreshFetch = async () => {
    return await fetch(`${API_URL}/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: localStorage.getItem('refresh') })
    })
}