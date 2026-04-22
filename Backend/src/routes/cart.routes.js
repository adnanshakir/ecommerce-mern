import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const  router = express.Router();

/*
 * @route POST /api/cart/add
 * @desc Add item to cart
 * @access Private
 * @agruments:
 *   - productId: ID of the product to add (body)
 *   - variantId: ID of the variant to add (optional, body)
 *   - quantity: Quantity to add (optional, body, default 1)
 */
router.post(
  "/add",
  authenticateUser,
  validateAddToCart,
  addToCart,
);

/*
* @route GET /api/cart
* @desc Get user's cart
* @access Private
*/
router.get("/", authenticateUser, getCart);

export default router;
