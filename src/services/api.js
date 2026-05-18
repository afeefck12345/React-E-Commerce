import axios from "axios"

const API = axios.create({
  baseURL: "https://shophub-backend-xwam.onrender.com/api",
})

const firstImage = (value) => {
  if (Array.isArray(value?.images) && value.images.length > 0) return value.images[0];
  return value?.image || "";
};

const normalizeUser = (user = {}) => {
  const firstAddress = Array.isArray(user.addresses) ? user.addresses[0] : user.address;
  return {
    ...user,
    id: user._id || user.id,
    active: user.isActive !== false,
    address: firstAddress || {},
  };
};

const normalizeProduct = (product = {}) => ({
  ...product,
  id: product._id || product.id,
  image: firstImage(product),
  active: product.active !== false,
});

const normalizeCartItem = (item = {}) => {
  const product = item.product || {};
  return {
    id: product._id || item.productId || item.id,
    cartItemId: item._id,
    productId: product._id || item.productId || item.id,
    name: product.name || item.name,
    price: item.price ?? product.price ?? 0,
    image: firstImage(product) || item.image,
    category: product.category || item.category,
    stock: product.stock ?? item.stock ?? 0,
    quantity: item.quantity || 1,
  };
};

const normalizeWishlistItem = (product = {}) => ({
  id: product._id || product.productId || product.id,
  productId: product._id || product.productId || product.id,
  name: product.name,
  price: product.price,
  image: firstImage(product),
  category: product.category,
  stock: product.stock ?? 0,
});

const normalizeOrder = (order = {}) => ({
  ...order,
  id: order._id || order.id,
  userId: order.user?._id || order.user || order.userId,
  items: (order.orderItems || order.items || []).map((item) => ({
    productId: item.product?._id || item.product || item.productId,
    name: item.name || item.product?.name,
    image: item.image || firstImage(item.product),
    category: item.category || item.product?.category,
    price: item.price || 0,
    quantity: item.quantity || 1,
  })),
  total: order.totalPrice ?? order.total ?? 0,
  status: order.orderStatus || order.status || "pending",
  date: order.createdAt || order.date,
  address: order.shippingAddress
    ? [
        order.shippingAddress.street,
        order.shippingAddress.city,
        order.shippingAddress.pincode,
      ].filter(Boolean).join(", ")
    : order.address,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => {
    const data = response.data;
    const url = response.config.url || "";

    if (data?.user) response.data.user = normalizeUser(data.user);

    if (url.includes("/auth/")) return response;

    if (data?.products) response.data = data.products.map(normalizeProduct);
    else if (data?.product) response.data = normalizeProduct(data.product);
    else if (data?.users) response.data = data.users.map(normalizeUser);
    else if (data?.orders) response.data = data.orders.map(normalizeOrder);
    else if (data?.order) response.data = normalizeOrder(data.order);
    else if (data?.cart) response.data = (data.cart.items || []).map(normalizeCartItem);
    else if (data?.wishlist) response.data = (data.wishlist.products || []).map(normalizeWishlistItem);

    return response;
  },
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          `https://shophub-backend-xwam.onrender.com/api/auth/refresh-token`,
          { refreshToken }
        );

        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;

        return API(original);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API