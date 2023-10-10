import React, { useState, useEffect, useLocation } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';





function ViewFilters(props) {
    // const index = props["index"];
    const GlobalState=props["GlobalState"];
    const updateGlobalState=props["updateGlobalState"];
    const handleResourcesChange=props["handleResourcesChange"];
    const uiState=props["uiState"];

    // console.log('GlobalState.uiState:', GlobalState.uiState);


    // console.log('GlobalState: ', GlobalState);
    const checkboxes = uiState.dashboardDataTypes.map((dashboardDataType, index) => {
        // console.log('dashboardDataType: ', dashboardDataType);
        // return <Checkbox label={dashboardDataType["title"]}/>;

        // console.log(dashboardDataType.title, 'index: ', index, dashboardDataType.enabled);
        if(dashboardDataType.filter_exposed==true) {
            return (<FormControlLabel
                key={index}
                label={dashboardDataType.title}
                control={
                    <Checkbox
                        checked={dashboardDataType.enabled}
                        onChange={()=>{
                            console.log('dashboardDataType.enabled:', dashboardDataType.enabled);
                            handleResourcesChange(index, !dashboardDataType.enabled);

                        }}/>
                }
            />);
        }

    });
    // console.log('checkboxes: ', checkboxes);
    return (
        <div>
            {checkboxes}
        </div>);
}

export default ViewFilters;