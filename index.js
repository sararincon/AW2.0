const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = process.env.PORT || 3000;
const { v4: uuidv4 } = require("uuid");

const config = {
  user: "sararincon",
  host: "localhost",
  database: "alwaysmusic",
  password: "postgres",
  port: 5432,
};
const pool = new Pool(config);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Read usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const dbquery = "SELECT * FROM usuarios";
    const data = await pool.query(dbquery);
    res.status(200).json({ count: data.rowCount, items: data.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Create usuario
app.post("/usuario", async (req, res) => {
  const uid = uuidv4().slice(0, 6);
  const { nombre, rut, curso, nivel } = req.body;
  const dbquery = `INSERT INTO usuarios ( nombre, rut, curso, nivel, uuid) VALUES ('${nombre}', '${rut}', '${curso}', '${nivel}', '${uid}')`;
  const data = await pool.query(dbquery);
  console.log(data);
  res.status(200).json({ message: "Estudiante creado correctamente" });
});

//Update usuario
app.patch("/usuario", async (req, res) => {
  const { nombre, uid } = req.body;
  const dbquery = `UPDATE usuarios SET nombre = '${nombre}' WHERE uuid = '${uid}'`;
  const data = await pool.query(dbquery);
  console.log(data);
  res.status(200).json({ message: "Estudiante actualizado correctamente" });
});

//Delete usuario
app.delete("/usuario/:uuid", async (req, res) => {
  const { uuid } = req.params;
  const dbquery = `DELETE FROM usuarios WHERE uuid = '${uuid}'`;
  const data = await pool.query(dbquery);
  console.log(data);
  res.status(200).json({ message: "Estudiante eliminado correctamente" });
});

//buscando usuario por uuid
app.get("/usuario/:uuid", async (req, res) => {
  const { uuid } = req.params;
  const dbquery = `SELECT * FROM usuarios WHERE uuid = '${uuid}'`;
  const data = await pool.query(dbquery);
  console.log(data);
  res.status(200).json({ count: data.rowCount, items: data.rows });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
