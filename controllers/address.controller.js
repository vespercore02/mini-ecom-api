const Address = require("../models/Address");

exports.createAddress = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      full_name,
      phone,
      address_line,
      city,
      postal_code,
      is_default
    } = req.body;

    if (is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: userId } }
      );
    }

    const address = await Address.create({
      user_id: userId,
      full_name,
      phone,
      address_line,
      city,
      postal_code,
      is_default: is_default || false
    });

    res.json(address);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating address" });
  }
};


exports.getAddresses = async (req, res) => {
  try {

    const userId = req.user.id;

    const addresses = await Address.findAll({
      where: { user_id: userId },
      order: [["is_default", "DESC"]]
    });

    res.json(addresses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching addresses" });
  }
};

exports.updateAddress = async (req, res) => {
  try {

    const userId = req.user.id;
    const { id } = req.params;

    const address = await Address.findOne({
      where: { id, user_id: userId }
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const updates = req.body;

    if (updates.is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: userId } }
      );
    }

    await address.update(updates);

    res.json(address);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating address" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {

    const userId = req.user.id;
    const { id } = req.params;

    const address = await Address.findOne({
      where: { id, user_id: userId }
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await address.destroy();

    res.json({ message: "Address deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting address" });
  }
};