import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", checkJwt, UserController.listAll);

router.get("/cep/:id([0-9]+)", UserController.getCEP);

router.get("/:id([0-9]+)", [checkJwt], UserController.getMovieById);

router.post("/", UserController.newUser);

router.patch("/:id([0-9]+)", [checkJwt], UserController.editMovie);

router.delete("/:id([0-9]+)", [checkJwt], UserController.deleteMovie);

export default router;
