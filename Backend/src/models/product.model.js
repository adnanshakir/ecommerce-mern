import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: ["tops", "bottoms"],
    },

    subCategory: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: ["tshirts", "shirts", "tanks", "jeans", "trousers"],
    },
    price: {
      type: priceSchema,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    variants: [
      {
        images: [
          {
            url: {
              type: String,
              required: true,
            },
          },
        ],
        stock: {
          type: Number,
          default: 0,
        },
        attributes: {
          type: Map,
          of: String,
        },
        price: {
          type: priceSchema,
        },
      },
    ],
  },
  { timestamps: true },
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
