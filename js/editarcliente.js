(function(){

    let DB;
    let idCliente;
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
         idCliente = parametrosURL.get('id');
        if(idCliente){
            setTimeout( () =>{
                obtenerCliente(idCliente);
            },1000);
            
        }

    });

    function actualizarCliente(e){
        e.preventDefault();
        if(nombreInput.value ===''|| emailInput.value ===''|| empresaInput.value ==='' || telefonoInput.value ===''){
              imprimirAlerta('Todos los campos son pbligatorios', 'error');
            return;
        }
        //actualizar Cliente 
        const clienteActualizado = {
            nombre : nombreInput.value,
            email : empresaInput.value,
            empresa : emailInput.value,
            telefono : telefonoInput.value,
            id : Number(idCliente)

        }
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteActualizado);
        transaction.oncomplete = function(){
            imprimirAlerta('Editado Correctamente');
            setTimeout(() =>{
                window.location.href = 'index.html';
            }, 3000)
        };
        transaction.onerror = function(){
            imprimirAlerta('Hubo un error', 'error');
        }


    }

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