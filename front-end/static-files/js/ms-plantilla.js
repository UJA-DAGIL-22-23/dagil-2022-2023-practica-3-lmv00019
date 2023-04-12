/**
 * @file Plantilla.js
 * @description Funciones para el procesamiento de la info enviada por el MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

"use strict";

/// Creo el espacio de nombres
let Plantilla = {};



// Plantilla de datosDescargados vacíos
Plantilla.datosDescargadosNulos = {
    mensaje: "Datos Descargados No válidos",
    autor: "",
    email: "",
    fecha: ""
}

// Tags que voy a usar para sustituir los campos
Plantilla.plantillaTags = {
    "ID": "### ID ###",
    "NOMBRE": "### NOMBRE ###",
    "FECHA": "### FECHA ###",
    "DIA": "### DIA ###",
    "MES": "### MES ###",
    "ANIO": "### ANIO ###",
    "DIRECION": "### DIRECCION ###",
    "CALLE": "### CALLE ###",
    "LOCALIDAD": "### LOCALIDAD ###",
    "PROVINCIA": "### PROVINCIA ###",
    "PAIS": "### PAIS ###",
    "PARTICIPACION MUNDIAL": "### PARTICIPACION MUNDIAL ###",
    "NUMERO_PARTICIPACIONES_JJOO": "### NUMERO_PARTICIPACIONES_JJOO ###",
    "LATERALIDAD": "### LATERALIDAD ###"
}

Plantilla.sustituyeTags = function (plantilla, persona) {
    return plantilla
        .replace(new RegExp(Plantilla.plantillaTags.ID, 'g'), persona.ref['@ref'].id)
        .replace(new RegExp(Plantilla.plantillaTags.NOMBRE, 'g'), persona.data.nombre)
        .replace(new RegExp(Plantilla.plantillaTags.FECHA, 'g'), persona.data.fecha)
        .replace(new RegExp(Plantilla.plantillaTags.DIA, 'g'), persona.data.fecha.dia)
        .replace(new RegExp(Plantilla.plantillaTags.MES, 'g'), persona.data.fecha.mes)
        .replace(new RegExp(Plantilla.plantillaTags.ANIO, 'g'), persona.data.fecha.anio)
        .replace(new RegExp(Plantilla.plantillaTags.DIRECCION, 'g'), persona.data.direccion)
        .replace(new RegExp(Plantilla.plantillaTags.CALLE, 'g'), persona.data.direccion.calle)
        .replace(new RegExp(Plantilla.plantillaTags.LOCALIDAD, 'g'), persona.data.direccion.localidad)
        .replace(new RegExp(Plantilla.plantillaTags.PROVINCIA, 'g'), persona.data.direccion.provincia)
        .replace(new RegExp(Plantilla.plantillaTags.PAIS, 'g'), persona.data.direccion.pais)
        .replace(new RegExp(Plantilla.plantillaTags["PARTICIPACION MUNDIAL"], 'g'), persona.data.participacion_mundial)
        .replace(new RegExp(Plantilla.plantillaTags.NUMERO_PARTICIPACIONES_JJOO, 'g'), persona.data.numero_participaciones_jo)
        .replace(new RegExp(Plantilla.plantillaTags.LATERALIDAD, 'g'), persona.data.lateralidad)
}

Plantilla.actualiza = function (persona) {
    return Plantilla.sustituyeTags(this.cuerpo, persona)
}



/**
 * Función que descarga la info MS Plantilla al llamar a una de sus rutas
 * @param {string} ruta Ruta a descargar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.descargarRuta = async function (ruta, callBackFn) {
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + ruta
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro la info que se han descargado
    let datosDescargados = null
    if (response) {
        datosDescargados = await response.json()
        callBackFn(datosDescargados)
    }
}


/**
 * Función principal para mostrar los datos enviados por la ruta "home" de MS Plantilla
 */
Plantilla.mostrarHome = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene el campo mensaje
    if (typeof datosDescargados.mensaje === "undefined") datosDescargados = this.datosDescargadosNulos

    Frontend.Article.actualizar("Plantilla Home", datosDescargados.mensaje)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "acerca de" de MS Plantilla
 */
Plantilla.mostrarAcercaDe = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene los campos mensaje, autor, o email
    if (typeof datosDescargados.mensaje === "undefined" ||
        typeof datosDescargados.autor === "undefined" ||
        typeof datosDescargados.email === "undefined" ||
        typeof datosDescargados.fecha === "undefined"
    ) datosDescargados = this.datosDescargadosNulos

    const mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    Frontend.Article.actualizar("Plantilla Acerca de", mensajeAMostrar)
}

/**
 * Función que recuperar todas las personas llamando al MS Personas
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */

Plantilla.recupera = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio personas
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/getTodas"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todas las persoans que se han descargado
    let vectorPersonas = null
    if (response) {
        vectorPersonas = await response.json()
        callBackFn(vectorPersonas.data)
    }
}



Plantilla.listadoTodos = function (vector) {
    //console.log( vector ) // Para comprobar lo que hay en vector
    let msj = "";
    msj += Plantilla.cabecera();
    vector.forEach(e => msj += Plantilla.cuerpo(e))
    msj += Plantilla.pie();

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar( "Listado de jugadores", msj )

}


Plantilla.listadoNombres = function (vector) {
    //console.log( vector ) // Para comprobar lo que hay en vector
    let msj = "";
    msj += Plantilla.cabecera_nombres();
    vector.forEach(e => msj += Plantilla.cuerpo_nombres(e))
    msj += Plantilla.pie();

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar( "Listado de jugadores por nombre", msj )

}

/**
 * Crea la cabecera para mostrar la info como tabla
 * @returns Cabecera de la tabla
 */
Plantilla.cabecera = function () {
    return `<table class="listado-plantilla">
        <thead>
        <th>Nombre</th><th>Fecha</th><th>Direccion</th><th>Años participacion mundial</th><th>Numero de participaciones</th><th>Lateralidad</th>
        </thead>
        <tbody>
        `
    ;
}

Plantilla.cabecera_nombres = function () {
    return `<table class="listado-plantilla"><thead><th>Nombre</th></thead><tbody>`;
}



/**
 * Muestra la información de cada proyecto en un elemento TR con sus correspondientes TD
 * @param {proyecto} p Datos del proyecto a mostrar
 * @returns Cadena conteniendo todo el elemento TR que muestra el proyecto.
 */
Plantilla.cuerpo = function (p) {
    const d = p.data
    const fecha = d.fecha;
    const direccion = d.direccion;

    return `<tr title="${p.ref['@ref'].id}">
    <td>${d.nombre}</td>
    <td>${fecha.dia}/${fecha.mes}/${fecha.anio}</td>
    <td>${direccion.calle},${direccion.localidad},${direccion.provincia},${direccion.pais}</td>
    <td>${d.participacion_mundial}</td>
    <td>${d.numero_participaciones_jo}</td>
    <td>${d.lateralidad}</td>
    </tr>
    `;
}


Plantilla.cuerpo_nombres = function (p) {
    const d = p.data

    return `<td>${d.nombre}</td></tr>`;
}


/**
 * Pie de la tabla en la que se muestran las personas
 * @returns Cadena con el pie de la tabla
 */
Plantilla.pie = function () {
    return "</tbody></table>";
}

/**
 * Función principal para responder al evento de elegir la opción "Home"
 */
Plantilla.procesarHome = function () {
    this.descargarRuta("/plantilla/", this.mostrarHome);
}

/**
 * Función principal para responder al evento de elegir la opción "Acerca de"
 */
Plantilla.procesarAcercaDe = function () {
    this.descargarRuta("/plantilla/acercade", this.mostrarAcercaDe);
}



/**
 * Función principal para responder al evento de elegir la opción "Listado jugadores"
 */
Plantilla.muestraTodos = function () {
    //this.descargarRuta("/plantilla/getTodos", this.listadoTodos());
    this.recupera(this.listadoTodos);
}


Plantilla.muestraNombres = function () {
    //this.descargarRuta("/plantilla/getTodos", this.listadoTodos());
    this.recupera(this.listadoNombres);
}







