require('dotenv').config()

const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = process.env.PORT || 3000;
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Read usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const SQLQuery= {
      rowMode: "array",
      text:  "SELECT * FROM usuarios",
  }
    const data = await pool.query(SQLQuery);
    res.status(200).json({ count: data.rowCount, items: data.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Create usuario
app.post("/usuario", async (req, res) => {
  try{
  const uid = uuidv4().slice(0, 6);
  const { nombre, rut, curso, nivel } = req.body;
  const SQLQuery = {
  text: "INSERT INTO usuarios ( nombre, rut, curso, nivel, uuid) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
  values: [nombre, rut, curso, nivel, uid],
  }
  const data = await pool.query(SQLQuery);
  console.log(data.rows[0]);
  res.status(200).json({ message: "Estudiante creado correctamente" });
}
catch (error) {
  res.status(500).json({ error: error.message })
  }
});

//Update usuario
app.patch("/usuario", async (req, res) => {
  try{
    const { nombre, uid } = req.body;
  const SQLQuery = {
    text: "UPDATE usuarios SET nombre = $1 WHERE uuid = $2 RETURNING *;",
    values: [nombre, uid],
  }
  const data = await pool.query(SQLQuery);
  console.log("Registro modficado:", data.rows[0]);
  res.status(200).json({ message: "Estudiante actualizado correctamente" });

  }catch (error) {
    res.status(500).json({ error: error.message })
    }

  
});

//Delete usuario
app.delete("/usuario/:uuid", async (req, res) => {

  try{
    const { uuid } = req.params;
    if(!uuid) throw new MyError (400, 'Debes colocar un parametro UUID')
    if(uuid.length !== 6) throw new MyError (400, 'Debes colocar un parametro UUID correcto')
   
    
     await pool.query({
    text:  "DELETE FROM usuarios WHERE uuid = $1",
    values: [uuid]
});
  res.status(200).json({ message: `Estudiante ${uuid} eliminado correctamente` });

  }catch (error) {

    console.log (error.code, error.message);
    
    res.status(error.code).json({ message: error.message })
  }
});

//buscando usuario por uuid
app.get("/usuario/:uuid", async (req, res) => {
  try{
    const { uuid } = req.params;
    
      const SQLQuery ={
      text: "SELECT * FROM usuarios WHERE uuid = $1",
      values: [uuid]
    }
  const data = await pool.query(SQLQuery);
  // if(!uuid) throw new MyError(400, 'UUID no existe')
  console.log(data);
  res.status(200).json({ count: data.rowCount, items: data.rows });
  }catch (error) {
    res.status(500).json({ error: error.message })
    console.log({ error: error.message })
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
