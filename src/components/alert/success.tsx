import React from 'react';

const Alert = ({ text }) => (
    <div id="alert" className="alert alert-success" role="alert">
        <span className="alert-inner--text"><strong>Well done!</strong> {text}</span>
    </div>
)
export default Alert;