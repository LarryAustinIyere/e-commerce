import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((previousTotalPrice) => previousTotalPrice + product.price * quantity);
        setTotalQuantities((previousTotalQuantities) => previousTotalQuantities + quantity);

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updatedCartItems);
        } else {
            product.quantity = quantity;

            setCartItems([...cartItems, { ...product }]);
        }
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id);

        const newCartItems = cartItems.filter((item) => item._id !== id)

        if (value === 'increment') {
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
            setTotalPrice((previousTotalPrice) => previousTotalPrice + foundProduct.price)
            setTotalQuantities(previousTotalQuantities => previousTotalQuantities + 1)
        } else if (value === 'decrement') {
            if (foundProduct.quantity > 1) {
                setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
                setTotalPrice((previousTotalPrice) => previousTotalPrice - foundProduct.price)
                setTotalQuantities(previousTotalQuantities => previousTotalQuantities - 1)
            }
        }
    }

    const increaseQty = () => {
        setQty((previousQty) => previousQty + 1);
    }

    const decreaseQty = () => {
        setQty((previousQty) => {
            if (previousQty - 1 < 1) return 1;

            return previousQty - 1;
        });
    }

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                increaseQty,
                decreaseQty,
                onAdd,
                toggleCartItemQuantity
            }}
        >
            {children}
        </Context.Provider>
    )

}


export const useStateContext = () => useContext(Context);