import React from 'react';

const Alert = ({ text }) => (
    <div id="alert" className="alert alert-info" role="alert">
        <span className="alert-inner--text"><strong>Heads up!</strong> {text}</span>
    </div>
)
export default Alert;