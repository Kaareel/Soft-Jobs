const express = require('express')
const cors = require('cors')
const jwt = require("jsonwebtoken")
const app = express()


app.use(cors())
app.use(express.json())

app.listen(3001, console.log('Server ON'))
const { obtenerUsuarios, registrarUsuario, verificarCredenciales } = require('./consulta')

app.use((req, res, next) => {
    const parametros = req.params;
    const method = req.method
    const url = req.url;
    console.log(`
      Hoy ${new Date()}
      Se ha recibido una consulta en la ruta ${url}
      con los parámetros: `, parametros)
    if (url === "/usuarios" && method === "POST") {
        const { password, email } = req.body
        if (!password || !email) {
            res.status(400).send(error)
        }
    }
    return next();
});

app.post('/usuarios', async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con éxito")

    }
    catch (error) {
        res.status(500).send(error)
    }
})

app.get('/usuarios', async (req, res) => {
    try {
        console.log(req)
        const token = req.headers['authorization'].replace('Bearer ', '')
        const { email } = jwt.decode(token)
        const user = await obtenerUsuarios(email);
        console.log(user)
        res.json(user[0])
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "az_AZ", { expiresIn: 60 })
        res.send(token)
    }
    catch (error) {
        res.status(error.code || 500).send(error)

    }

})
