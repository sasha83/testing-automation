import React from 'react';

export default function BlockContent(props) {
    const className = 'block-'+props.blockName+'-content'
    return <div className={className}>{props.content}</div>
}