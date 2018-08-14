var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('Nombre y Sala son necesario!'); 
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

//"on" son para escuchar eventos!
socket.on('connect', function() {
    console.log('Conectado al servidor!');
    socket.emit('entrarChat',usuario,function(resp){
        console.log('usuarios conectados! ',resp);
    });
});

socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor!');
});

//"emit" son para enviar eventos!
// socket.emit('crearMensaje', {
//     usuario: 'Jefry Sánchez',
//     mensaje: 'Hola mundo!'
// }, function (resp) {
//     console.log('Respuesta del server: ', resp);
// });


//enviar mensaje del servidor al cliente informando que un cliente abandono el chat

socket.on('crearMensaje', function (mensaje) {
    console.log('Servidor', mensaje);
});

//Escuchar cambios
//cuando un usuario entra o sale del chat
socket.on('listaPersona',function (personas){
    console.log(personas);
});

//Mensaje Privado
socket.on('mensajePrivado',function(mensaje){
    console.log('Mensaje Privado:', mensaje);
});