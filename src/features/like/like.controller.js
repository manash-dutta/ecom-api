import LikeRepository from "./like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userId = req.userId;
      if (type !== "Product" && type !== "Category") {
        return res.status(400).send("Invalid Type");
      }
      if (type === "Product") {
        await this.likeRepository.likeProduct(userId, id);
      } else {
        await this.likeRepository.likeCategory(userId, id);
      }
      return res.status(201).send("Like updated")
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async getLikes(req, res, next) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepository.getLikes(type, id);
      return res.status(200).send(likes);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}
