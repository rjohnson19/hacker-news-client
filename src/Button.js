import React, { Component } from 'react';

class Button extends Component {
    render() {
        const {
            onClick,
            className = '' , // default to empty string if not provided.
            children
        } = this.props;

        return (
            <button
                onClick={onClick}
                className={className}
                type="button"
            >
            {children}
            </button>
        )
    }

}

export default Button;