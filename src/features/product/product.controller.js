import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    // try {
    //   const products = await this.productRepository.getAll();
    //   res.status(200).send(products);
    // } catch (err) {
    //   console.error(err);
    //   return res.status(400).send("Unable to load products");
    // }
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.error(err);
      res.status(400).send("Unable to load products");
    }
  }

  async postAddProduct(req, res) {
    // try {
    //   const { name, desc, price, sizes, category, inStock } = req.body;
    //   const newProduct = new ProductModel(
    //     name,
    //     desc,
    //     parseFloat(price),
    //     req.file.filename,
    //     category,
    //     sizes.split(","),
    //     parseFloat(inStock)
    //   );
    //   const product = await this.productRepository.add(newProduct);
    //   res.status(201).send(product);
    // } catch (err) {
    //   console.error(err);
    //   return res.status(400).send("Unable to add product");
    // }
    try {
      const { name, desc, price, sizes, inStock, categories } =
        req.body;
      const newProduct = {
        name,
        desc,
        price: parseFloat(price),
        imageUrl: req.file.filename,
        // category,
        sizes: sizes.split(","),
        inStock: parseFloat(inStock),
        categories: categories.split(","),
      };
      const product = await this.productRepository.add(newProduct);
      res.status(201).send(product);
    } catch (err) {
      console.error(err);
      res.status(400).send("Unable to add product");
    }
  }

  async getOneProduct(req, res) {
    // try {
    //   const id = req.params.id;
    //   const product = await this.productRepository.get(id);
    //   res.status(200).send(product);
    // } catch (err) {
    //   console.error(err);
    //   res.status(404).send("Product not found");
    // }
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      res.status(200).send(product);
    } catch (err) {
      console.error(err);
      res.status(404).send("Product not found");
    }
  }

  async getFilteredProducts(req, res) {
    try {
      const { minPrice, maxPrice, category } = req.query;
      const filteredProducts = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
      );
      res.status(200).send(filteredProducts);
    } catch (err) {
      console.error(err);
      res.status(400).send("No products match your search parameters");
    }
  }

  async rateProduct(req, res, next) {
    try {
      const userId = req.userId;
      const { productId, rating } = req.body;

      await this.productRepository.rate(userId, productId, rating);
      return res.status(200).send("Rating has been added");
    } catch (err) {
      console.error(err);
      return res.status(400).send("Something went wrong");
      next(err);
    }
  }

  async averagePrice(req, res, next) {
    try {
      const result =
        await this.productRepository.averageProductPricePerCategory();
      return res.status(200).send(result);
    } catch (err) {
      console.error(err);
      return res.status(400).send("Something went wrong");
    }
  }

  async averageRating(req, res) {
    try {
      const name = req.query.name;
      const result = await this.productRepository.getAverageRatingPerProduct(
        name
      );
      console.log(result);
      return res.status(200).send(result);
    } catch (err) {
      console.error(err);
      return res.status(400).send("Something went wrong");
    }
  }
}
