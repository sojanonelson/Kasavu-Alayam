export const selectCartItems = (state) => state.cart.items;

export const selectCartTotalQuantity = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.quantity, 0);

export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
