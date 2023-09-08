const URL = "http://localhost/tarea1/BD.php";
const RUTA = 'BD.php';

document.addEventListener('DOMContentLoaded', function () {
    const contenedor_html = document.getElementById('lista_objetos_BD');

    //----------------------------------------------
    // Función para cargar la lista de objetos
    function cargarObjetos() {
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            // se genera una repeticion por cada elemento que trae de la BD. 
            data.forEach(item => {

                const contenedorTarea = document.createElement("div");
                contenedorTarea.classList.add('contenedor_tarea');

                const divID = document.createElement("div");
                divID.textContent = `ID: ${item.ID}`;
                divID.classList.add('ID_tarea');

                const divNombre = document.createElement("div");
                divNombre.textContent = `Nombre: ${item.nombre}`;
                divNombre.classList.add('nombre_tarea');

                const divEstado = document.createElement("div");
                divEstado.textContent = `Estado: ${item.estado}`;
                divEstado.classList.add('estado_tarea');

                // Botón de eliminar para cada objeto
                const eliminarBoton = document.createElement('button');
                eliminarBoton.textContent = 'Eliminar';
                eliminarBoton.classList.add('eliminar_boton'); // Asigna una clase al botón
                eliminarBoton.addEventListener('click', () => {
                    eliminarObjetoPorID(item.ID); // Llama a la función de eliminación
                });

                // Botón de modificar para cada objeto
                const modificarBoton = document.createElement('button');
                modificarBoton.textContent = 'Modificar';
                modificarBoton.classList.add('modificar_boton'); // Agrega la clase modificar_boton al botón
                modificarBoton.addEventListener('click', () => {
                    
                });

                // Se agrega todas las cosas anteriormente creado
                contenedorTarea.appendChild(divID);
                contenedorTarea.appendChild(divNombre);
                contenedorTarea.appendChild(divEstado);
                contenedorTarea.appendChild(eliminarBoton);
                contenedorTarea.appendChild(modificarBoton);

                contenedor_html.appendChild(contenedorTarea);
                
            });
        })
        .catch(error => console.error('Error:', error));
    }

    //----------------------------------------------
    // Función para eliminar un objeto por ID
    function eliminarObjetoPorID(id) {
        fetch(URL, {method: 'DELETE',})
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error al eliminar el objeto');
            }
        })
        .then(data => {
            console.log(data.message); // Muestra el mensaje de éxito en la consola
            // Actualiza la lista de objetos después de eliminar
            contenedor_html.innerHTML = ''; // Borra la lista actual
            cargarObjetos(); // Vuelve a cargar la lista de objetos
        })
        .catch(error => console.error('Error:', error));
    }

    //----------------------------------------------
    // Función para agregar un nuevo objeto
    function agregarObjeto(nombre, estado) {
        const objeto = { nombre, estado };
    
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objeto)
        })
        .then(response => {
            if (response.status === 201) {
                return response.json();
            } else {
                throw new Error('Error al agregar el objeto');
            }
        })
        .then(data => {
            console.log(data.message); // Muestra el mensaje de éxito en la consola
            // Actualiza la lista de objetos después de agregar
            objectList.innerHTML = ''; // Borra la lista actual
            cargarObjetos(); // Vuelve a cargar la lista de objetos
        })
        .catch(error => console.error('Error:', error));
    }

    //----------------------------------------------
    // Función para actualizar un objeto por ID
    function actualizarObjetoPorID(id, nombre, estado) {
        const objeto = { ID: id, nombre, estado };
    
        fetch(URL+`/id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objeto)
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error al actualizar el objeto');
            }
        })
        .then(data => {
            console.log(data.message); // Muestra el mensaje de éxito en la consola
            // Actualiza la lista de objetos después de la actualización
            objectList.innerHTML = ''; // Borra la lista actual
            cargarObjetos(); // Vuelve a cargar la lista de objetos
        })
        .catch(error => console.error('Error:', error));
    }

    // Se le agrega una funcion al boton para que este cree una nueva tarea
    document.getElementById('boton_agregar').addEventListener('click', function() {
        // Obtener valores de los inputs
        const nombreObjeto = document.getElementById('nombre_tarea').value;
        
        const estadoSelect = document.getElementById('estadoSelect');
        const estadoInput = document.getElementById('estado');

        const estadoSelect2 = document.getElementById('estado');
        const estadoSeleccionado = estadoSelect2.options[estadoSelect2.selectedIndex].value;

        estadoInput.value = estadoSelect.value;

        // Obtener el último ID
        const ultimoID = obtenerUltimoID();

        // Llamar a la función para agregar la tarea
        agregarObjeto(nombreObjeto, estadoSeleccionado);
        
        // Log de aviso de que tarea se agrego
        //log(`Se agregó la tarea: Nombre: ${nombreObjeto}, Estado: ${estadoInput}, ID: ${ultimoID}`);

        // Actualizacion de los objetos
        contenedor_html.innerHTML = '';
        cargarObjetos();
    });

    // Función para obtener el último ID (debes implementarla según tu lógica)
    function obtenerUltimoID() {
        return 9;
    }

    cargarObjetos(); // Carga la lista de objetos al cargar la página
});