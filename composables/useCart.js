export const useCart = () => {
  const { getItem, setItem } = useUtils();
  const cart = useState("cart", () => ({
    showCart: false,
    validate: false,
    items: [],
  }));

  const removeItem = (i) => {
    try {
      cart.value.items.splice(i, 1);
      updateCart();
    } catch (error) {
      console.error(error);
    }
  };

  const increaseQuantity = (i) => {
    try {
      cart.value.items[i].quantity++;
      updateCart();
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQuantity = (i) => {
    try {
      if (cart.value.items[i].quantity > 1) {
        cart.value.items[i].quantity--;
        updateCart();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateCart = () => {
    try {
      setItem("cart", JSON.stringify(cart.value.items));
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = (item) => {
    try {
      if (!item) return;
      const localCart = [...cart.value.items];
      const {
        _id,
        name,
        slug,
        price,
        discountPrice,
        discountStatus,
        thumbnail,
        updatedAt,
        variation,
      } = item;

      localCart.push({
        _id,
        name,
        slug,
        price,
        discountPrice,
        discountStatus,
        thumbnail,
        updatedAt,
        quantity: 1,
        variation,
      });
      cart.value.items = localCart;
      updateCart();
    } catch (error) {
      console.error("ami anik", error);
    }
  };

  const loadCart = () => {
    try {
      let localCart = getItem("cart", JSON.stringify([]));
      if (localCart) {
        localCart = JSON.parse(localCart);
      }
      cart.value.items = localCart;
    } catch (error) {
      console.error(error);
    }
  };

  const validateItems = async () => {
    try {
      if (
        cart.value.items &&
        cart.value.items.length > 0 &&
        !cart.value.validate
      ) {
        const { api } = useApi();
        const { products } = await api.post("/store/cart-validate-items", {
          items: cart.value.items.map((item) => item._id),
        });
        const validItems = cart.value.items.filter((item) => {
          return products.some(
            (product) =>
              product._id === item._id &&
              new Date(product.updatedAt).getTime() ===
                new Date(item.updatedAt).getTime()
          );
        });
        cart.value.items = validItems;
        updateCart();
      }
      cart.value.validate = true;
    } catch (error) {
      console.error(error);
    }
  };

  if (typeof window !== "undefined") loadCart();

  return {
    addToCart,
    loadCart,
    cart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    validateItems,
  };
};
