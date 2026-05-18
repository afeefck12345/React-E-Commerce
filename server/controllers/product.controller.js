import Product from "../models/Product.js";

// GET /api/products?page=1&limit=10&category=&search=&minPrice=&maxPrice=
export const getProducts = async (req, res, next) => {
  try {
    const page     = parseInt(req.query.page)  || 1;
    const limit    = parseInt(req.query.limit) || 10;
    const skip     = (page - 1) * limit;

    const filter = { active: { $ne: false } };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.search)   filter.$text    = { $search: req.query.search };
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.featured) filter.isFeatured = true;

    const sort = {};
    if (req.query.sort === "price_asc")  sort.price = 1;
    if (req.query.sort === "price_desc") sort.price = -1;
    if (req.query.sort === "newest")     sort.createdAt = -1;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// POST /api/products  (admin)
export const createProduct = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      images: req.body.images || (req.body.image ? [req.body.image] : []),
    };
    const product = await Product.create(payload);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id  (admin)
export const updateProduct = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      images: req.body.images || (req.body.image ? [req.body.image] : undefined),
    };
    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id  (admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

// POST /api/products/:id/reviews  (protected)
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) return res.status(400).json({ message: "Product already reviewed" });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.numReviews = product.reviews.length;
    product.ratings    =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: "Review added" });
  } catch (error) {
    next(error);
  }
};
