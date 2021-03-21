(function(){

    let DB;
    //llenas los input
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');
    

    document.addEventListener('DOMContentLoaded', () =>{
        conectarDB();

        //Actualiza el registro
        formulario.addEventListener('submit', actualizarCliente);
        //verificar la ID de la URL 
        const parametrosURL = new URLSearchParams(window.location.search);
        const idCliente = parametrosURL.get('id');
        if(idCliente){
            setTimeout( () =>{
                obtenerCliente(idCliente);
            },1000);
            
        }

    });

    function obtenerCliente(id){
        const transaction= DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
               
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }

    }

    //funcion llenar formularios 
    function llenarFormulario(datosCliente){

        const { nombre, email, telefono, empresa} = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;



    }

    //funcion conectar base de datos 
    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm',1);
        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        }
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        }
    }

})();