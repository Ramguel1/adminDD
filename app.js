var tPresupuesto = parseInt(localStorage.getItem("presupuesto"));
var gastos = JSON.parse(localStorage.getItem("gastos")) || [];
var divPresupuesto = document.querySelector('#divPresupuesto');
var presupuesto = document.querySelector('#presupuesto');
var btnPresupuesto = document.querySelector('#btnPresupuesto');
var divGastos = document.querySelector('#divGastos');
var progress = document.querySelector("#progress");
var tGastos = 0;
var disponible = 0;

const inicio = () => {
    tPresupuesto = parseInt(localStorage.getItem("presupuesto"));
    if (tPresupuesto >= 0) {
        divPresupuesto.classList.remove("d-block")
        divGastos.classList.remove("d-none")
        divPresupuesto.classList.add("d-none")
        divGastos.classList.add("d-block")
        totalPresupuesto.innerHTML = `$ ${tPresupuesto.toFixed(2)}`;
        mostrarGastos();
    } else {
        divPresupuesto.classList.remove("d-none")
        divGastos.classList.remove("d-block")
        divPresupuesto.classList.add("d-block")
        divGastos.classList.add("d-none")
        presupuesto.value = 0;
    }
}



btnPresupuesto.onclick = () => {
    tPresupuesto = parseInt(presupuesto.value);
    localStorage.setItem('presupuesto', tPresupuesto)
    if (tPresupuesto <=0 || tPresupuesto.trim()=="") ) {
        Swal.fire({ icon: "error", title: "ERROR", text: "Presupuesto mayor a 0" });
        return;
    }

    divPresupuesto.classList.remove("d-block");
    divGastos.classList.remove("d-none");
    divPresupuesto.classList.add("d-none");
    divGastos.classList.add("d-block");
    mostrarGastos();

}
const guardarGasto = () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let descripcion = document.getElementById("descripcion").value;
    let costo = parseInt(document.getElementById("costo").value);
    let categoria = document.getElementById("categoria").value;
    if (descripcion.trim() == "" || document.getElementById("costo").value.trim() === "" || costo == 0) {
        Swal.fire({ icon: "error", title: "ERROR", text: "DATOS INCORRECTOS" });
        return;
    }
    if (costo > disponible) {
        Swal.fire({ icon: "error", title: "ERROR", text: "YA NO TIENES FONDOS" });
        return;
    }
    const gasto = { descripcion, costo, categoria }
    gastos.push(gasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));
    bootstrap.Modal.getInstance(document.getElementById("nuevoGasto")).hide();
    mostrarGastos()
}
document.querySelector('#filtrarcategoria').addEventListener('change', function() {
    mostrarGastos(this.value);
});
const mostrarGastos = (categoria = "todos") => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let gastosHTML = ``;
    tGastos = 0;
    if (gastos.length == 0) {
        document.getElementById('listaGastos').innerHTML = gastosHTML || `<b>NO HAY GASTOS</b>`;
    pintarDatos();
    }
    index = 0;
    tGastos = 0;
    gastos.forEach((gasto, index) => {
        if (categoria === gasto.categoria || categoria == "todos") {
            gastosHTML += `
            <div class="card text-center w-100 m-auto mt-3 p-2">
            <div class="row">
            <div class="col"><img src="img/${gasto.categoria}.png" class="imgCategoria shadow width="100px" height="100px""></div>
            <div class="col text-start">
            <p><b>Descripcion:</b> <small>${gasto.descripcion}</small></p>            
            <p><b>Costo:</b> <small>${parseInt(gasto.costo).toFixed(2)}</small></p>
            </div>
            <div class="col">
            <button class="btn btn-outline-primary" onclick="cargarGasto(${index})" data-bs-toggle="modal" data-bs-target="#editarGasto">Editar</button>
            <button class="btn btn-outline-danger" onclick="deleteGasto(${index})">DEL</button>
</div>
            </div>
    </div> `
            tGastos += parseInt(gasto.costo);
            
    
        }
    })
    document.getElementById('listaGastos').innerHTML = gastosHTML || `<b>NO HAY GASTOS</b>`;
     pintarDatos()
    
}

const pintarDatos = () => {
    let totalPresupuesto = document.querySelector("#totalPresupuesto");
    let totalDisponible = document.querySelector("#totalDisponible");
    let totalGastos = document.querySelector("#totalGastos");
    var tPresupuesto = parseInt(localStorage.getItem("presupuesto"));
    disponible = tPresupuesto - tGastos;
    let porcentaje = 100 - ((tGastos / tPresupuesto) * 100);
    progress.innerHTML = `<circle-progress value="${porcentaje}" min="0" max="100" text-format="percent"></circle-progress>`
    totalGastos.innerHTML = `$ ${tGastos.toFixed(2)}`;
    totalPresupuesto.innerHTML = `$ ${tPresupuesto.toFixed(2)}`;
    totalDisponible.innerHTML = `$ ${disponible.toFixed(2)}`;
    
}
listaGastos 

const reset = () => {
    Swal.fire({
        title: " Esta seguro de salir??",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "SI",
        denyButtonText: `NO`,
        cancelButtonColor: "#dc3545",
        confirmButtonColor: "#198754",
        denyButtonColor: "#dc3545",
    }).then((result) => {
        if(result.isConfirmed){
            localStorage.clear();
            inicio();
        }
       
    });
            
   
        
}

const actualizarGasto = () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    let descripcion = document.getElementById("edescripcion").value;
    let costo = parseInt(document.getElementById("ecosto").value);
    let categoria = document.getElementById("ecategoria").value;
    let index = parseInt(document.getElementById("eindex").value);
    if (descripcion.trim() == "" || costo == 0) {
        Swal.fire({ icon: "error", title: "ERROR", text: "Datos incorrectos" });
        return;

    }
    let costoAnterior = parseInt(gastos[index].costo);
    if (costo > (costoAnterior + disponible)) {
        Swal.fire({ icon: "error", title: "ERROR", text: "Ya no tienes fondos" });
        return;
    }
    gastos[index].descripcion = descripcion;
    gastos[index].costo = costo;
    gastos[index].categoria = categoria
    localStorage.setItem("gastos", JSON.stringify(gastos));
    bootstrap.Modal.getInstance(document.getElementById("editarGasto")).hide();
    mostrarGastos();
}

const cargarGasto = (index) => {
    var gasto = gastos[index];
    document.getElementById("edescripcion").value = gasto.descripcion;
    document.getElementById("ecosto").value = gasto.costo;
    document.getElementById("ecategoria").value = gasto.categoria;
    document.getElementById("eindex").value = index;
}

const deleteGasto = (index) => {
    Swal.fire({
        title: " Esta seguro de Eliminar?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "SI",
        denyButtonText: `NO`,
        cancelButtonColor: "#dc3545",
        confirmButtonColor: "#198754",
        denyButtonColor: "#dc3545",
    }).then((result) => {
        if(result.isConfirmed){
            Swal.fire("Eliminado", "", "success");
        gastos.splice(index, 1)
        localStorage.setItem("gastos", JSON.stringify(gastos));
        mostrarGastos() 
        }
       
    });
}
