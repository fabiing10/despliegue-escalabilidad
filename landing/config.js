/*
 * Configuración de la landing: textos de los banners, casos de uso y planes.
 * Cambie aquí los textos; no hace falta tocar index.html ni landing.js.
 *
 * Es un archivo .js (y no .json) para que la página funcione también al
 * abrirla con doble clic: los navegadores no permiten leer .json desde file://.
 */
window.LANDING_CONFIG = {

  /* A dónde lleva el formulario. No se envía ningún dato: la herramienta
     actual no tiene registro ni recibe datos precargados. */
  destinoFormulario: "../index.html#/inventario",

  /* Banner dinámico 1: barra superior */
  anuncios: {
    intervaloMs: 6000,
    mensajes: [
      "Vea en segundos qué contratos están por vencer su plazo de liquidación.",
      "Genere el borrador del oficio de requerimiento con los documentos que faltan.",
      "Prototipo con datos ficticios: la herramienta sugiere, usted decide."
    ]
  },

  /* Banner dinámico 2: casos de uso (ejemplos con los datos ficticios del prototipo) */
  casosDeUso: {
    intervaloMs: 9000,
    etiqueta: "Ejemplo con datos ficticios",
    casos: [
      {
        perfil: "Abogada de la oficina de contratación",
        titulo: "Cierra una obra sin olvidar el amparo de estabilidad",
        situacion: "Tiene una obra de adecuación de sede terminada el 30 de septiembre y no recuerda qué documentos llegaron.",
        enLaHerramienta: [
          "La ficha le muestra que la liquidación bilateral vence el 2027-01-30 y está en verde.",
          "La lista de obra, de nueve documentos, marca en No el informe final, las garantías y el amparo de estabilidad.",
          "Genera el oficio con esos tres documentos y lo revisa antes de tramitarlo."
        ]
      },
      {
        perfil: "Jefe de la oficina de contratación",
        titulo: "Llega al comité con el panorama completo",
        situacion: "Le piden saber cuántos contratos están en riesgo y por cuánto dinero.",
        enLaHerramienta: [
          "El tablero cuenta los contratos de cada color del semáforo.",
          "El valor en riesgo suma los contratos en naranja, rojo y negro.",
          "La lista de los cinco más urgentes trae la fecha límite y los días restantes."
        ]
      },
      {
        perfil: "Profesional que recibe contratos de otra administración",
        titulo: "Detecta los contratos que ya se pasaron de plazo",
        situacion: "Hereda contratos terminados hace años y no sabe cuáles todavía puede liquidar.",
        enLaHerramienta: [
          "Los que superaron la fecha máxima aparecen primero, en negro, como competencia perdida sugerida.",
          "Los extemporáneos aparecen en rojo, con los días que faltan para la fecha máxima.",
          "Es una sugerencia: la decisión jurídica sigue siendo suya."
        ]
      },
      {
        perfil: "Supervisor de convenios",
        titulo: "Revisa lo propio de un convenio",
        situacion: "Un convenio cultural necesita el acta de reintegro de saldos y la garantía no aplica.",
        enLaHerramienta: [
          "La lista suma el informe de ejecución de recursos y el acta de reintegro de saldos.",
          "Marca las garantías como N/A y la completitud se calcula solo sobre los documentos aplicables.",
          "El oficio incluye únicamente lo que sigue pendiente."
        ]
      }
    ]
  },

  /* Precios (demo). Máximo tres planes. Sin pasarela de pagos.
     Todos los planes tienen hoy las mismas funciones: la herramienta no
     distingue planes. Lo que no existe queda marcado "POR DEFINIR". */
  precios: {
    etiqueta: "Precios de referencia. Versión demo.",
    planes: [
      {
        id: "prueba",
        nombre: "Prueba",
        precio: "$0",
        periodo: "",
        descripcion: "Explore el prototipo con diez contratos ficticios.",
        destacado: false,
        incluye: [
          "Todas las funciones actuales de la herramienta",
          "10 contratos de ejemplo",
          "Datos guardados solo en su navegador",
          "Sin cuentas ni contraseñas"
        ]
      },
      {
        id: "profesional",
        nombre: "Profesional",
        precio: "$90.000",
        periodo: "COP al mes",
        descripcion: "Para el abogado o profesional que lleva sus propios cierres.",
        destacado: true,
        incluye: [
          "Todas las funciones actuales de la herramienta",
          "Carga de sus propios contratos: POR DEFINIR",
          "Soporte: POR DEFINIR"
        ]
      },
      {
        id: "oficina",
        nombre: "Oficina de contratación",
        precio: "POR DEFINIR",
        periodo: "",
        descripcion: "Para equipos que necesitan compartir el inventario.",
        destacado: false,
        incluye: [
          "Todas las funciones actuales de la herramienta",
          "Inventario compartido entre usuarios: POR DEFINIR",
          "Número de usuarios: POR DEFINIR",
          "Soporte e implementación: POR DEFINIR"
        ]
      }
    ]
  }
};
