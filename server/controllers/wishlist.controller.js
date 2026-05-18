import Wishlist from "../models/Wishlist.js";

// GET /api/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("products", "name images price discountPrice ratings");
    if (!wishlist) return res.json({ success: true, wishlist: { products: [] } });
    res.json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

// POST /api/wishlist  { productId }
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: "Already in wishlist" });
      }
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate("products", "name images price category stock discountPrice ratings");
    res.json({ success: true, message: "Added to wishlist", wishlist });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    );
    await wishlist.save();
    await wishlist.populate("products", "name images price category stock discountPrice ratings");
    res.json({ success: true, message: "Removed from wishlist", wishlist });
  } catch (error) {
    next(error);
  }
};
