import { useState } from 'react';

const allowed = ['GET', 'POST', 'PUT', 'DELETE']

export const useSubmit = (method: string, url: RequestInfo, body?: object, handleResponse?: Function) => {
    const [value, setValue] = useState(undefined);
    const [error, setError] = useState(undefined);

    if (allowed.includes(method) === false) { throw Error(`Unsupported method ${method} supplied`); }

    const request = async () => {
        try {
            const options: RequestInit = {
                method: method,
            }

            if (body) {
                options.headers = { 'Content-Type': 'application/json' };
                options.body = JSON.stringify(body);
            }

            const response = await fetch(url, options);
            if (handleResponse) {
                handleResponse(response);
            }

            const json = await response.json();
            return json;
        } catch (error) {
            return {
                data: undefined,
                error: 'Invalid server response'
            }
        }
    }

    return {
        value,
        error,
        reset: () => {
            setValue(undefined);
            setError(undefined);
        },
        bind: {
            onSubmit: async event => {
                event.preventDefault();
                const data = await request();
                setValue(data);
                setError(error);
            }
        }
    };
};