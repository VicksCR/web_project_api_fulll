//Aun falta modificar el archivo comparando con SP18Desp
require("dotenv").config();
//console.log("Variables de entorno:", process.env.NODE_ENV);

const express = require("express");
const mongoose = require("mongoose");
const { errors: celebrateErrors, celebrate, Joi } = require("celebrate");
const { validateURL } = require("./middleware/validators");
//const cors = require("cors");

const { createUser, login } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middleware/logger");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const auth = require("./middleware/auth");

const NotFoundError = require("./errors/not-found-err");

const { PORT = 3000 } = process.env;
const app = express();

//Conexion a MongoDB
mongoose.connect("mongodb://localhost:27017/aroundb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
/*
//Configuración de CORS
app.use(
  cors({
    origin: [
      "https://aroundcr.minnsroad.com",
      "https://www.aroundcr.minnsroad.com",
    ],
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  })
);
 */
app.use(requestLogger);

/*
No creo que se deba usar throw
//Ruta de prueba para crash (verifica que PM2 o reinicio automático funciona)
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caerse");
  }, 0);
});
*/

//Rutas publicas (no token)
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateURL),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

//Middleware de manejo de errores centralizado
app.use((req, res, next) => {
  next(new NotFoundError("Recurso solicitado no encontrado"));
});

//Middleware de manejo de errores Celebrate
app.use(errorLogger);

//app.use(errors());
app.use(celebrateErrors());

// PENDIENTE DE PONER app.use(errorHandler);
//revisar que con handle error se puede borrar esto

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === 500 ? "Se ha producido un error en el servidor" : message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
