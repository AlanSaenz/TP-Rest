<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tarea1";

$conexion = new mysqli($servername, $username, $password, $dbname);

//Si la conexion  la bd falla este termina su proceso y devuelve un error
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

//----------------------------------------
// Metodo GET
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['id'])) {
        // Obtener un objeto específico por ID
        $id = $_GET['id'];
        $sql = "SELECT * FROM tarea WHERE ID = $id";
    } else {
        // Obtener todos los objetos
        $sql = "SELECT * FROM tarea";
    }

    // Se genera la conexion a la base de datos en una nueva variable dependiendo de los resultados anteriores.
    $result = $conexion->query($sql);

    // Si el resultado tiene mas de 0 elementos continuara y devolvera el elemento json $data
    if ($result->num_rows > 0) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        header("Content-Type: application/json");
        echo json_encode($data);
    } else {
        // En caso de que esto falle devuelve error
        header("HTTP/1.1 404 Not Found");
        echo json_encode(array('message' => 'No se encontraron objetos en la base de datos.'));
    }
}

//----------------------------------------
// Metodo POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Crear un nuevo objeto
    $input = json_decode(file_get_contents('php://input'), true);
    $nombre = $input['nombre'];
    $estado = $input['estado'];

    // Se genera la conexion a la base de datos
    $sql = "INSERT INTO tarea (nombre, estado) VALUES ('$nombre', '$estado')";

    if ($conexion->query($sql) === TRUE) {
        $last_id = $conexion->insert_id;
        $response = array('message' => 'Objeto creado con éxito', 'id' => $last_id);
        header("HTTP/1.1 201 Creado");
        echo json_encode($response);
    } else {
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(array('message' => 'Error al crear el objeto: ' . $conexion->error));
    }
}

//----------------------------------------
// Metodo DELETE
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    if (isset($_GET['id'])) {
        // Eliminar un objeto por ID
        $id = $_GET['id'];
        // Se genera la conexion a la base de datos
        $sql = "DELETE FROM tarea WHERE ID = $id";

        // Si la conexion es exitosa este elimina el objeto y devuelve un aviso del mismo
        if ($conexion->query($sql) === TRUE) {
            $response = array('message' => 'Objeto eliminado con éxito');
            header("HTTP/1.1 200 OK");
            echo json_encode($response);
        } else {
            // En caso de que este fall devuelve un error para eliminar el objeto
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(array('message' => 'Error al eliminar el objeto: ' . $conexion->error));
        }
    } else {
        // En caso de que no se ingrese un ID este devuelve un error solicitando la falta de un ID
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(array('message' => 'Se requiere un ID para eliminar el objeto.'));
    }
}

//----------------------------------------
// Metodo PUT
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    // Actualizar un objeto por ID
    // Primero trasnforma el json de la BD en un elemento llamado input
    $input = json_decode(file_get_contents('php://input'), true);
    
    $id = $input['ID'];
    $nombre = $input['nombre'];
    $estado = $input['estado'];

    // Se genera la conexion a la base de datos
    $sql = "UPDATE tarea SET nombre = '$nombre', estado = '$estado' WHERE ID = $id";

    // Si esta solicitud es correcta, actualiza el objeto devolviendo un aviso
    if ($conexion->query($sql) === TRUE) {
        $response = array('message' => 'Objeto actualizado con éxito');
        header("HTTP/1.1 200 OK");
        echo json_encode($response);
    } else {
        // En caso de que este falle se le informa del error
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(array('message' => 'Error al actualizar el objeto: ' . $conexion->error));
    }
}

$conexion->close();

?>