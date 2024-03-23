import { Router } from "express";
import * as createUser from "../controllers/registro.js"
import * as Iniciarsesion from "../controllers/login.js"

export const router = Router();

// registro //
router.post("/register",createUser.createUsers);
// login //
router.post("/login",Iniciarsesion.Login);