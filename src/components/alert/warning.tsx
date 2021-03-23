import React from 'react';

const Alert = ({ text }) => (
    <div id="alert" className="alert alert-warning" role="alert">
        <span className="alert-inner--text"><strong>Warning!</strong> {text}</span>
    </div>
)
export default Alert;