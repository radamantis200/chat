const {io} = require('../server');
const {Usuarios} = require('../classes/usuarios');
const {crearMensaje} = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    console.log('Usuario conectado!');

    client.on('entrarChat',(data,callback)=>{
        console.log(data);
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/Sala es necesario!'
            });
        }
    
        client.join(data.sala);
       usuarios.agregarPersona(client.id,data.nombre,data.sala);

       client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasSalas(data.sala));

       callback(usuarios.getPersonasSalas(data.sala));     
    });

    client.on('crearMensaje',(data)=>{
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre,data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje);
    });

    client.on('disconnect',()=>{
        let personaBorrada = usuarios.borrarPersonas(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} abandono el chat!`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasSalas(personaBorrada.sala));
    });

    //mensajes privados
    client.on('mensajePrivado',data =>{
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.id,data.mensaje));
    });
});