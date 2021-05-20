import React from 'react'
import { Container, Typography, Button, Grid } from "@material-ui/core";
import useStyles from './styles';
import { Link } from 'react-router-dom';

import CartItem from './CartItem/CartItem';

const Cart = ({ cart, handleEmptyCart, handleRemoveFromCart, handleUpdateCartQty }) => {
    const classes = useStyles();
    
    const EmptyCart = () => {
        return (
        <Typography variant="subtitle1">
            You have no items your shopping cart..
             Go back to the <Link to="/" className={classes.link}>homepage</Link>!
        </Typography>
        )
    }

    const FilledCart = () => {
        return (
        <>
            <Grid container spacing={3}>
                {
                    cart.line_items.map((item) => (
                        <Grid item xs={12} sm={4} key={item.id}>
                            <CartItem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} />
                        </Grid>
                    ))
                }
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    Subtotal: { cart.subtotal.formatted_with_symbol }
                </Typography>
                <div>
                    <Button onClick={handleEmptyCart} className={classes.emptyButton} size="large" variant="contained" type="button" color="secondary">Empty Cart</Button>
                    <Button className={classes.checkoutButton} size="large" variant="contained" type="button" color="primary" component={Link} to="/checkout">Checkout</Button>
                </div>
            </div>
        </>
        )
    }

    if (!cart.line_items.length) return 'Loading...';

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom>Your shopping cart</Typography>            
            {
                !cart.line_items.length ? <EmptyCart /> : <FilledCart />
            }
        </Container>
    )
}

export default Cart
