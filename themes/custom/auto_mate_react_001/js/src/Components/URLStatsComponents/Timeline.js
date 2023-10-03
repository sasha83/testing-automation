import React, { useState, useEffect, useLocation } from 'react';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';

function Timeline(props) {
    const GlobalState = props["GlobalState"];
    const {urlData} = props["GlobalState"];
    let activeLHRData = [];
    // let urlDataTemp=[];
    urlData.forEach(function(url) {
        // console.log('url.lhrData:',url.lhrData);
        if(url.lhrData) {
            // let lhrDataTemp=[];
            url.lhrData.forEach(function(lhr) {
                if(lhr.enabledUI==true) {
                    activeLHRData.push('<div>'+lhr.title+'|'+lhr.field_fetch_time+'</div>');
                }
            });
    
        }
    });
    // const activeLHRTemp = url.map(function(lhreports, lhrData) {

    // });

        // const activeLHRs = url.lhrData.map((url.lhrData, index) => {
        //     const activeLHRTemp = url.lhrData.filter(obj => {
        //         return obj.enabledUI === true;
        //     })
        //     console.log('activeLHRTemp:',activeLHRTemp);
        //     return <p>{url.nid}</p>;
        // });
    
    console.log(activeLHRData);
    return <div>{ activeLHRData.join('') }</div>;
}

export default Timeline;