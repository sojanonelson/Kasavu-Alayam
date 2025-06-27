const Cart = require('../models/Cart');
const Product = require('../models/Product');

// 🛒 Add or update item in cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId });

    const productPrice = parseFloat(product.specialPrice || product.price);
    const totalItemPrice = quantity * productPrice;

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
        totalPrice: totalItemPrice
      });
    } else {
      // Update existing cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      // Recalculate total
      let newTotal = 0;
      for (const item of cart.items) {
        const prod = await Product.findById(item.productId);
        if (prod) {
          const price = parseFloat(prod.specialPrice || prod.price);
          newTotal += price * item.quantity;
        }
      }
      cart.totalPrice = newTotal;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// ❌ Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    console.log("UserID:", userId)

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // Recalculate total
    let newTotal = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.productId);
      if (prod) {
        const price = parseFloat(prod.specialPrice || prod.price);
        newTotal += price * item.quantity;
      }
    }

    cart.totalPrice = newTotal;
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// 🧾 Get user's cart
exports.getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error getting cart' });
  }
};


// 🔄 Update quantity of an item in cart
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    console.log(userId)

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    item.quantity = quantity;

    // 🔁 Recalculate total
    let newTotal = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.productId);
      if (prod) {
        const price = parseFloat(prod.specialPrice || prod.price);
        newTotal += price * item.quantity;
      }
    }

    cart.totalPrice = newTotal;
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};
