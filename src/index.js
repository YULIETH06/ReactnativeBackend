import express from "express";
import { router } from "./router/formulario.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.listen(3001, () => {
    console.log(`Servidor corriendo en puerto 3001`);
});

// Ruta index
app.use("/api", router);
