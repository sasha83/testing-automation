import React, { useState, useEffect, useLocation } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';




function ViewFilters(props) {
    console.log('ViewFilters');
// onChange={GlobalState.handleResourcesChange} 
    const handleResourcesChange=props["handleResourcesChange"];

    const GlobalState=props["GlobalState"];
    console.log('GlobalState.uiState:', GlobalState.uiState);


    // console.log('this:', this);
    const checkboxes = GlobalState.uiState.dashboardDataTypes.map((dashboardDataType, index) => {
        // console.log('dashboardDataType: ', dashboardDataType);
        // return <Checkbox label={dashboardDataType["title"]}/>;

        console.log('ViewFilters2');

        return <FormControlLabel
            key={index}
            label={dashboardDataType.title}
            control={
                <Checkbox
                    checked={dashboardDataType.enabled}
                    onChange={()=>{
                        handleResourcesChange(dashboardDataType.title, !dashboardDataType.enabled);

                    }}/>
            }
        />




    });
    // console.log('checkboxes: ', checkboxes);
    return (
        <div>
            {checkboxes}
        </div>);
}

export default ViewFilters;