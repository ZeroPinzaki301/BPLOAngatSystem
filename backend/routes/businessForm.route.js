import express from "express";
import {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness
} from "../controllers/businessForm.controller.js";

const router = express.Router();

router.post("/", createBusiness);        
router.get("/", getBusinesses);          
router.get("/:id", getBusinessById);     
router.put("/:id", updateBusiness);      
router.delete("/:id", deleteBusiness);   

export default router;