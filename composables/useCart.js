export const useCart = () => {
  const { getItem, setItem } = useUtils();
  const cart = useState("cart", () => ({
    showCart: false,
    items: [],
  }));
  const removeItem = (i) => {
    cart.value.items.splice(i, 1);
    updateCart();
  };
  const increaseQuantity = (i) => {
    cart.value.items[i].quantity++;
    console.log(cart.value.items[i].quantity);
    updateCart();
  };
  const decreaseQuantity = (i) => {
    if (cart.value.items[i].quantity > 1) {
      cart.value.items[i].quantity--;
      updateCart();
    }
  };
  const updateCart = () => {
    setItem("cart", JSON.stringify(cart.value.items));
  };
  const addToCart = (item) => {
    if (!item) return;
    let localCart = getItem("cart", JSON.stringify([]));
    if (localCart) {
      localCart = JSON.parse(localCart);
    }
    localCart.push(item);
    updateCart();
    cart.value.items = localCart;
  };
  const loadCart = () => {
    let localCart = getItem("cart", JSON.stringify([]));
    if (localCart) {
      localCart = JSON.parse(localCart);
    }
    cart.value.items = localCart;
  };
  if (process.client) {
    loadCart();
  }

  return {
    addToCart,
    loadCart,
    cart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
  };
};
