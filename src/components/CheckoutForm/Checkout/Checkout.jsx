import React, { useState, useEffect } from 'react'
import { Paper, CssBaseline, Stepper, Step, StepLabel, Typography, CircularProgress, Button, Divider } from "@material-ui/core";
import { Link, useHistory } from 'react-router-dom';

import useStyles from './styles'
import  AddressForm from '../AddressForm'
import  PaymentForm from '../PaymentForm'

import { commerce } from '../../../lib/commerce';

const steps = ['Shipping Address', 'Payment details']

const Checkout = ({ cart, error, order, onCaptureCheckout }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false);

    const classes = useStyles();
    const history = useHistory();

    const Form = () => activeStep === 0 ? 
    <AddressForm checkoutToken={checkoutToken} next={next} /> : 
    <PaymentForm timeout={timeout} nextStep={nextStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} backStep={backStep} checkoutToken={checkoutToken} />;
    
    let Confirmation = () => (order.customer ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase, {order.curstomer.firstname} {order.customer.lastname}</Typography>
                <Divider className={classes.divder} />
                <Typography variant="subtitle2">Order reference: {order.customer_reference}</Typography>
            </div><br />
            <Button variant="outlined" type="button" component={Link} to='/'>Back to home</Button>
        </>
    ) : isFinished ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase!</Typography>
                <Divider className={classes.divder} />
            </div><br />
            <Button variant="outlined" type="button" component={Link} to='/'>Back to home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    ));

    if (error) {
        <>
            <Typography variant="h5">Error: {error}</Typography><br />
            <Button variant="outlined" type="button" component={Link} to='/'>Back to home</Button>
        </>
    }

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart'});
                console.log(token);
                setCheckoutToken(token);
            }
            catch (error) {
                history.pushState('/');
            }
        }

        generateToken();
    }, [cart])

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const next = (data) => {
        setShippingData(data);
        nextStep();
    }

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true);
        }, 3000);
    }

    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant="h4" align="center">Checkout</Typography>
                <Stepper activeStep={activeStep} className={classes.stepper}>
                    {
                        steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))
                    }
                </Stepper>
                    {
                        activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />
                    }
            </Paper>
            </main>   
        </>
    )
}

export default Checkout
