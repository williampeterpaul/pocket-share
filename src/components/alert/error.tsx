import React from 'react';

const Alert = ({ text }) => (
    <div id="alert" className="alert alert-danger" role="alert">
        <span className="alert-inner--text"><strong>Oh snap!</strong> {text}</span>
    </div>
)

export default Alert;