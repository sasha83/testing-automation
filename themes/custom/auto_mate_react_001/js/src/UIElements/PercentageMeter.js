import React from 'react';

export default function PercentageMeter(props) {
    const outerWidth = props['outer-width'];
    const setWidth = function(w) {
        if(w&&w!=undefined&&w!=null) {
            return w;
        } else { 
            return 'auto';
        }
    }
    return (<div
        className="percentage-meter"
        style={{ 'width': setWidth(outerWidth)}}>
        <div 
            className="percentage-amount"
            style={{
                width: (props.value*100)+"%",
                backgroundColor: "hsl(" + (props.value * 120 ) + ", 50%, 60%)"
            }}>
        </div>
    </div>);
}