import React, { useState, useEffect } from 'react'
import { InputLabel, Select, MenuItem, Grid, Typography, Button } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';

import FormInput from './CustomTextField';
import { commerce } from '../../lib/commerce'

const AddressForm = ({ checkoutToken, next }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubDivisions, setShippingSubDivisions] = useState([]);
    const [shippingSubDivision, setShippingSubDivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');

    const methods = useForm();
    const countries = Object.entries(shippingCountries).map(([code, name]) =>({ id: code, label: name}));
    const subdivisions = Object.entries(shippingSubDivisions).map(([code, name]) =>({ id: code, label: name}));
    const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})`}));

    const fetchShippingCountries = async (checkoutTokenID) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenID);
        console.log(countries);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    }

    const fetchSubDivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
        setShippingSubDivisions(subdivisions);
        setShippingSubDivision(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenID, country, region=null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenID, { country, region });
        setShippingOptions(options);
        setShippingOption(options[0].id);
    }

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    }, [])

    useEffect(() => {
        if (shippingCountry) fetchSubDivisions(shippingCountry);
    }, [shippingCountry])

    useEffect(() => {
        if (shippingSubDivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubDivision)
    }, [shippingSubDivision])
    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider { ...methods }>
                <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubDivision, shippingOption }))}>
                    <Grid container spacing={3}>
                        <FormInput name='firstName' label='First name' />
                        <FormInput name='lastName' label='Last name' />
                        <FormInput name='email' label='Email' />
                        <FormInput name='address1' label='Address' />
                        <FormInput name='city' label='City' />
                        <FormInput name='zip' label='ZIP / Postal code' />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping country</InputLabel>
                            <Select variant="outlined" value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                {
                                    countries.map((country) => (
                                        <MenuItem key={country.id} value={country.id}>
                                    {country.label}
                                    </MenuItem>
                                    ))
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping subdivision</InputLabel>
                            <Select variant="outlined" value={shippingSubDivision} fullWidth onChange={(e) => setShippingSubDivision(e.target.value)}>
                                {
                                    subdivisions.map((subdivision) => (
                                        <MenuItem key={subdivision.id} value={subdivision.id}>
                                    {subdivision.label}
                                    </MenuItem>
                                    ))
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping option</InputLabel>
                            <Select variant="outlined" value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                                {
                                    options.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                    </MenuItem>
                                    ))
                                }
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <Button component={Link} to="/cart" variant="outlined">Back to cart</Button>
                        <Button type="submit" variant="contained" color="primary">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
