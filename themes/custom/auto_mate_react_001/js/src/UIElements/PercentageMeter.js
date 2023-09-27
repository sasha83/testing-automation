import React from 'react';

export default function PercentageMeter(props) {
    return <div className="percentage-meter">
        <div 
            className="percentage-amount"
            style={{
                width: (props.value*100)+"%",
                backgroundColor: "hsl(" + (props.value * 120 ) + ", 50%, 60%)"
            }}>
        </div>
    </div>;
}