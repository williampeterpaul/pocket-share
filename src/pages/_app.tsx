import React, { useState } from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client'
import Alert from '../components/alert'
import '../styles.css'

const sessionOptions = {
    clientMaxAge: 2 * 60 * 60, // Re-fetch session if cache is older than 2 hours
    keepAlive: 60 * 60 // Send keepAlive message every hour
};

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
    const [session, setSession] = useState(pageProps.session);
    const [alert, setAlert] = useState({ code: undefined, text: undefined });

    const updateAlert = (code: number, text: string, timeout: number = 5000) => {
        setAlert({ code, text });
        setTimeout(() => setAlert({ code: undefined, text: undefined }), timeout)
    }

    return (
        <Provider options={sessionOptions} session={session}>
            <Alert code={alert.code} text={alert.text} />
            <Component {...pageProps} updateSession={setSession} updateAlert={updateAlert} />
        </Provider>
    )
}

export default App
