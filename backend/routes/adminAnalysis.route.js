import express from "express";
import {
  getBusinessesWithFilters,
  getBusinessesByYear,
  getBusinessByControlNumber,
  searchBusinessesByName,
  searchBusinessesByAddress,
  getDashboardStatistics
} from "../controllers/adminAnalysis.controller.js";

const router = express.Router();

router.get("/businesses", getBusinessesWithFilters);

router.get("/by-year/:year", getBusinessesByYear);

router.get("/control-number/:controlNumber", getBusinessByControlNumber);

router.get("/search/name", searchBusinessesByName);

router.get("/search/address", searchBusinessesByAddress);

router.get("/dashboard", getDashboardStatistics);

export default router;