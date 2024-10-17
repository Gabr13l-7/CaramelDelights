const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3012;

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal (Inicio de sesión)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Usuario-index.html')); // Archivo de inicio de sesión
});

// Ruta para el registro de usuarios
app.get('/registrarse', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '4.2-Usuario-index.html')); // Archivo de registro
});

// Manejo de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('clientes.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo JSON');
        }

        const clientes = JSON.parse(data);
        const cliente = clientes.find(c => 
            c.username.toLowerCase() === username.trim().toLowerCase() && 
            c.password === password.trim()
        );

        if (cliente) {
            res.sendFile(path.join(__dirname, 'public', '2-index.html'));
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    });
});

// Manejo de registro de nuevos usuarios
app.post('/crear-cuenta', (req, res) => {
    const { nombre_completo, username, password, fecha_nacimiento } = req.body;

    fs.readFile('clientes.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo JSON');
        }

        const clientes = JSON.parse(data);
        const newId = clientes.length ? clientes[clientes.length - 1].id + 1 : 1; // Incrementa el id

        const nuevoUsuario = {
            _id: uuidv4(), // Genera un nuevo UUID
            id: newId,
            username,
            password,
            nombre_completo,
            fecha_nacimiento,
            created_at: new Date().toISOString() // Fecha y hora actuales
        };

        clientes.push(nuevoUsuario);

        fs.writeFile('clientes.json', JSON.stringify(clientes, null, 2), err => {
            if (err) {
                return res.status(500).send('Error al guardar el usuario');
            }
            res.status(200).json({ message: 'Usuario creado exitosamente' });
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});