function formatProduct(product, includeImages = false) {
  const plainProduct = product.toJSON ? product.toJSON() : product;

  const images = plainProduct.ProductImages || [];
  const coverImage = images.find(img => img.is_cover) || null;

  const formatted = {
    id: plainProduct.id,
    name: plainProduct.name,
    price: plainProduct.price,
    stock: plainProduct.stock,
    status: plainProduct.status,
    createdAt: plainProduct.createdAt,
    updatedAt: plainProduct.updatedAt,
    cover_image: coverImage
      ? {
          id: coverImage.id,
          image_url: coverImage.image_url,
          is_cover: coverImage.is_cover,
          sort_order: coverImage.sort_order ?? 0
        }
      : null
  };

  if (includeImages) {
    formatted.images = images
      .slice()
      .sort((a, b) => {
        if ((a.sort_order ?? 0) !== (b.sort_order ?? 0)) {
          return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        }
        return a.id - b.id;
      })
      .map(img => ({
        id: img.id,
        image_url: img.image_url,
        is_cover: img.is_cover,
        sort_order: img.sort_order ?? 0,
        createdAt: img.createdAt,
        updatedAt: img.updatedAt
      }));
  }

  return formatted;
}

module.exports = formatProduct;