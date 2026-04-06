const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");

exports.addProductImage = async (req, res) => {
  try {

    const { id } = req.params;
    const { image_url, is_cover = false, sort_order = 0 } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingImagesCount = await ProductImage.count({
      where: { product_id: id }
    });

    if (existingImagesCount >= 5) {
      return res.status(400).json({
        message: "Maximum of 5 images per product"
      });
    }

    let finalIsCover = is_cover;

    if (existingImagesCount === 0) {
      finalIsCover = true;
    }

    if (finalIsCover) {
      await ProductImage.update(
        { is_cover: false },
        { where: { product_id: id } }
      );
    }

    const image = await ProductImage.create({
      product_id: id,
      image_url,
      is_cover: finalIsCover,
      sort_order
    });

    res.json(image);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product image" });
  }
};

exports.getProductImages = async (req, res) => {
  try {

    const { id } = req.params;

    const images = await ProductImage.findAll({
      where: { product_id: id },
      order: [
        ["is_cover", "DESC"],
        ["sort_order", "ASC"],
        ["id", "ASC"]
      ]
    });

    res.json(images);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product images" });
  }
};

exports.setCoverImage = async (req, res) => {
  try {

    const { id, imageId } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const image = await ProductImage.findOne({
      where: {
        id: imageId,
        product_id: id
      }
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await ProductImage.update(
      { is_cover: false },
      { where: { product_id: id } }
    );

    await image.update({ is_cover: true });

    res.json({
      message: "Cover image updated successfully",
      image
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error setting cover image" });
  }
};

exports.deleteProductImage = async (req, res) => {
  try {

    const { id, imageId } = req.params;

    const image = await ProductImage.findOne({
      where: {
        id: imageId,
        product_id: id
      }
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const wasCover = image.is_cover;

    await image.destroy();

    if (wasCover) {
      const nextImage = await ProductImage.findOne({
        where: { product_id: id },
        order: [
          ["sort_order", "ASC"],
          ["id", "ASC"]
        ]
      });

      if (nextImage) {
        await nextImage.update({ is_cover: true });
      }
    }

    res.json({
      message: "Product image deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product image" });
  }
};