import React from 'react';
import Information from './information';
import Success from './success';
import Warning from './warning';
import Error from './error';

const Alert = ({ code, text }) => {

    const types = {
        1: <Information text={text} />,
        2: <Success text={text} />,
        3: <Warning text={text} />,
        4: <Error text={text} />,
        5: <Error text={text} />,
    }

    const RelayResponse = () => {
        if (code === null) return null;
        if (code === undefined) return null;

        const serial = code.toString()[0];
        const alert = types[serial];

        return alert;
    }

    return <RelayResponse />
}

export default Alert;