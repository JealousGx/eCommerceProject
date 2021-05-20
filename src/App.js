import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { commerce } from './lib/commerce';

import { Products, Navbar, Cart, Checkout } from './components';

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({line_items: []});
    const [order, setOrder] = useState({});
    const [errorMsg, setErrorMsg] = useState("");

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();
        setProducts(data);
    }

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    }

    const handleAddToCart = async (productID, quantity) => {
        const item = await commerce.cart.add(productID, quantity);
        setCart(item.cart);
    }

    const handleUpdateCartQty = async (productID, quantity) => {
        const { cart } = await commerce.cart.update(productID, { quantity });
        setCart(cart);
    }

    const handleRemoveFromCart = async (productID) => {
        const { cart } = await commerce.cart.remove(productID);
        setCart(cart);
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();
        setCart(cart);
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    }

    const handleCaptureCheckout = async (checkoutTokenID, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenID, newOrder);
            setOrder(incomingOrder);
            refreshCart();
        }
        catch (error) {
            setErrorMsg(error.data.error.message);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    
    console.log(cart);
    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch>
                    <Route exact path="/">
                        <Products products={products} onAddToCart={handleAddToCart} />
                    </Route>
                    <Route exact path="/cart">
                        <Cart 
                            cart={cart} 
                            handleEmptyCart={handleEmptyCart}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleUpdateCartQty={handleUpdateCartQty} />
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout 
                            cart={cart}
                            error={errorMsg}
                            order={order} 
                            onCaptureCheckout={handleCaptureCheckout} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App
