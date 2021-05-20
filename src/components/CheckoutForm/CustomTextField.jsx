import React from 'react'
import { TextField, Grid } from "@material-ui/core";
import { useFormContext, Controller } from "react-hook-form";

const FormInput = ({ name, label }) => {
    const { control } = useFormContext();

    return (
        <Grid item xs={12} sm={6}>
            <Controller 
                control={control}
                fullWidth
                name={name}
                defaultValue=""
                render = {({ field })=> (<TextField variant="outlined" required label={label} />)}
                />            
        </Grid>
    );
}

export default FormInput
