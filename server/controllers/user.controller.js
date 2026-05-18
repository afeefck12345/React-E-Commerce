import User from "../models/User.js";

const toAddressArray = (address, addresses) => {
  if (Array.isArray(addresses)) return addresses;
  if (!address) return undefined;
  return [{
    label: address.label || "Home",
    street: address.street || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
    country: address.country || "India",
  }];
};

// GET /api/users/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, avatar, address, addresses } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, avatar, addresses: toAddressArray(address, addresses) },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// GET /api/users (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/users/:id (admin)
export const updateAnyUser = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(payload, "active")) {
      payload.isActive = payload.active;
      delete payload.active;
    }
    if (payload.address || payload.addresses) {
      payload.addresses = toAddressArray(payload.address, payload.addresses);
      delete payload.address;
    }
    delete payload.password;

    const user = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
