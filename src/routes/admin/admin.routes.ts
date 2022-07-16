import { Router } from "express";
import transportationsRoutes from "./transportations.routes";
import hotelsRoutes from "./hotels.routes";
import countriesRoutes from "./countries.routes";
const router = Router();
router.use("/transportations", transportationsRoutes);
router.use("/hotels", hotelsRoutes);
router.use("/countries", countriesRoutes);
export default router;
