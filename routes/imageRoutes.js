import express from "express";
import { getAllImages } from "../controller/imageController.js";

const router = express.Router();

router.get("/", getAllImages);

export default router;
