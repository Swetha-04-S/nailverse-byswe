
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const CartContext = createContext(null);

// Read previously saved cart
const getSavedCart = () => {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem("nailverseCart")
    );

    return Array.isArray(savedCart) ? savedCart : [];

  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(getSavedCart);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "nailverseCart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // Add product to cart
  const addToCart = (product, quantity = 1) => {

    if (
      !product?._id ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return false;
    }

    if (
      product.isAvailable === false ||
      product.stock < 1 ||
      quantity > product.stock
    ) {
      return false;
    }

    const existingItem = cartItems.find(
      (item) => item._id === product._id
    );

    if (
      existingItem &&
      existingItem.quantity + quantity > product.stock
    ) {
      return false;
    }

    setCartItems((previousItems) => {

      const existing = previousItems.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return previousItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + quantity
              }
            : item
        );
      }

      return [
        ...previousItems,
        {
          ...product,
          quantity
        }
      ];
    });

    return true;
  };

  // Update product quantity
  const updateQuantity = (productId, quantity) => {

    if (!Number.isInteger(quantity)) return;

    setCartItems((previousItems) =>
      previousItems.map((item) => {

        if (item._id !== productId) {
          return item;
        }

        const safeQuantity = Math.max(
          1,
          Math.min(quantity, item.stock)
        );

        return {
          ...item,
          quantity: safeQuantity
        };
      })
    );
  };

  // Remove product
  const removeFromCart = (productId) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => item._id !== productId
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Total number of individual items
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total price
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access cart
export const useCart = () => {

  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};
