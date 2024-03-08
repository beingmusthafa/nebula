import React, { useState, createContext, SetStateAction } from "react";
export const CartWishlistContext = createContext<{
  cartCount: number;
  setCartCount: React.Dispatch<SetStateAction<number>>;
  wishlistCount: number;
  setWishlistCount: React.Dispatch<SetStateAction<number>>;
}>({
  cartCount: 0,
  setCartCount: () => {},
  wishlistCount: 0,
  setWishlistCount: () => {},
});

interface Props {
  children: React.ReactNode;
}
const CartWishlistContextComponent: React.FC<Props> = ({ children }) => {
  let [cartCount, setCartCount] = useState(0);
  let [wishlistCount, setWishlistCount] = useState(0);
  return (
    <CartWishlistContext.Provider
      value={{ cartCount, setCartCount, wishlistCount, setWishlistCount }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export default CartWishlistContextComponent;
