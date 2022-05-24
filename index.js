require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = process.env.PORT || 4000;
const { v4: uuidv4 } = require("uuid");

const config = {
  user: "sararincon",
  host: "localhost",
  database: "alwaysmusic20",
  password: "postgres",
  port: 5432,
};
const pool = new Pool(config);

class MyError extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }
}

function errorHandler(res, err) {
  console.log(err.code, err.message);
  if (typeof err.code !== "number")
    res.status(500).send({ message: err.message });
  res.status(err.code).send({ message: err.message });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Creando un usuario
app.post("/usuario", async (req, res) => {
  try {
    const uid = uuidv4().slice(0, 6);
    const { nombre, rut, curso, nivel } = req.body;
    if (!nombre || !rut || !curso || !nivel)
      throw new MyError(400, "Faltan datos para crear el usuario");
    const SQLQuery = {
      text: "INSERT INTO usuarios (nombre, rut, curso, nivel, uuid) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      values: [nombre, rut, curso, nivel, uid],
    };
    const data = await pool.query(SQLQuery);

    console.log("Usuario Creado", data.rows[0]);
    // console.log(data);
    res.status(201).json({ message: "Estudiante creado correctamente" });
  } catch (error) {
    errorHandler(res, error);
  }
});

// Leyendo usuarios registrados
app.get("/usuarios", async (req, res) => {
  try {
    const SQLQuery = {
      rowMode: "array",
      text: "SELECT * FROM usuarios",
    };
    const data = await pool.query(SQLQuery);
    // console.log(data.rows);
    res.status(200).json({ count: data.rowCount, items: data.rows });
  } catch (error) {
    errorHandler(res, error);
  }
});

//Buscando usuario por RUT
app.get("/usuario/:rut", async (req, res) => {
  try {
    const { rut } = req.params;
    if (!rut) throw new MyError(400, "Debes colocar un DNI Correcto");

    //Query
    const SQLQuery = {
      text: "SELECT * FROM usuarios WHERE rut = $1",
      values: [rut],
    };
    const data = await pool.query(SQLQuery);
    console.log(data.rows[0]);
    res.status(200).json({ count: data.rowCount, items: data.rows });
  } catch (error) {
    errorHandler(res, error);
  }
});

//Actualizando usuario
app.patch("/usuario", async (req, res) => {
  try {
    const { nombre, uuid } = req.body;
    if (!nombre || !uuid) {
      throw new MyError(400, "Faltan datos");
    }
    const SQLQuery = {
      text: "UPDATE usuarios SET nombre = $1 WHERE uuid = $2 RETURNING *;",
      values: [nombre, uuid],
    };
    const data = await pool.query(SQLQuery);
    console.log("Registro modficado:", data.rows[0]);
    res.status(200).json({ message: "Estudiante actualizado correctamente" });
  } catch (error) {
    errorHandler(res, error);
  }
});

//Eliminando usuario
app.delete("/usuario/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) throw new MyError(400, "Debes colocar un parametro UUID");
    if (uuid.length !== 6)
      throw new MyError(400, "Debes colocar un parametro UUID correcto");
    //Query
    await pool.query({
      text: "DELETE FROM usuarios WHERE uuid = $1",
      values: [uuid],
    });
    res
      .status(200)
      .json({ message: `Estudiante ${uuid} eliminado correctamente` });
  } catch (error) {
    errorHandler(res, error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
