import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const mapOrderItems = (items = [], orderItems = []) => {
  const source = orderItems.length ? orderItems : items;
  return source.map((item) => ({
    product: item.product || item.productId,
    name: item.name,
    image: item.image,
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 1,
  }));
};

const parseAddress = (body) => {
  if (body.shippingAddress) return body.shippingAddress;
  if (typeof body.address === "object" && body.address !== null) {
    return {
      street: body.address.line1 || body.address.street || "",
      city: body.address.city || "",
      state: body.address.state || "Kerala",
      pincode: body.address.pincode || "",
      country: body.address.country || "India",
    };
  }
  const [street = "", rest = ""] = String(body.address || "").split(",");
  const [city = "", pincode = ""] = rest.split("-");
  return {
    street: street.trim(),
    city: city.trim() || "Unknown",
    state: body.state || "Kerala",
    pincode: pincode.trim() || "000000",
    country: "India",
  };
};

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const orderItems = mapOrderItems(req.body.items, req.body.orderItems);
    if (!orderItems.length) return res.status(400).json({ message: "No order items" });

    const itemsPrice = Number(req.body.itemsPrice) ||
      orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingPrice = Number(req.body.shippingPrice) || 0;
    const taxPrice = Number(req.body.taxPrice) || 0;
    const totalPrice = Number(req.body.totalPrice || req.body.total) ||
      itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress: parseAddress(req.body),
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paymentMethod: req.body.paymentMethod || "cod",
      orderStatus: req.body.status || "pending",
      isPaid: req.body.paymentMethod === "cod" ? false : Boolean(req.body.isPaid),
    });

    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// POST /api/orders/create-razorpay-order
export const createRazorpayOrder = async (req, res, next) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ message: "Razorpay is not configured" });
    }

    const { orderItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(totalPrice * 100), // paise
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    });

    // Save pending order in DB
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paymentMethod: "razorpay",
      paymentResult: { razorpay_order_id: razorpayOrder.id },
    });

    res.status(201).json({
      success:       true,
      orderId:       order._id,
      razorpayOrder: {
        id:       razorpayOrder.id,
        amount:   razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/orders/verify-payment
export const verifyPayment = async (req, res, next) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay is not configured" });
    }

    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // HMAC verification
    const body      = razorpay_order_id + "|" + razorpay_payment_id;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Mark order as paid
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid:      true,
        paidAt:      new Date(),
        orderStatus: "processing",
        paymentResult: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status:  "paid",
          paid_at: new Date(),
        },
      },
      { new: true }
    );

    // Clear user cart after successful payment
    await Cart.findOneAndDelete({ user: req.user._id });

    res.json({ success: true, message: "Payment verified", order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "name images");
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders (admin gets all, users get own)
export const getAllOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("orderItems.product", "name images category");
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id
export const updateOrderStatus = async (req, res, next) => {
  try {
    const orderStatus = (req.body.orderStatus || req.body.status || "").toLowerCase();
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const update = { orderStatus };
    if (orderStatus === "delivered") {
      update.isDelivered = true;
      update.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/orders/:id
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    next(error);
  }
};
