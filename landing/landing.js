/* Comportamiento de la landing: banners rotativos, planes y formulario.
   Los textos vienen de config.js. Sin dependencias ni scripts de terceros. */
(function(){
  "use strict";
  var C = window.LANDING_CONFIG;
  if(!C) return;

  var reduceMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : {matches:false};

  function el(tag, attrs, texto){
    var e = document.createElement(tag);
    if(attrs) Object.keys(attrs).forEach(function(k){ e.setAttribute(k, attrs[k]); });
    if(texto != null) e.textContent = texto;
    return e;
  }

  /* Rotador genérico: pausa al pasar el cursor o enfocar con teclado,
     a petición del usuario, y no rota si se pidió reducir animaciones. */
  function crearRotador(raiz, total, mostrar, intervaloMs){
    var i = 0, timer = null, sobre = false, enfocado = false, pausado = false;
    function auto(){ return total > 1 && !reduceMotion.matches && !pausado && !sobre && !enfocado; }
    function programar(){
      clearInterval(timer); timer = null;
      if(auto()) timer = setInterval(function(){ ir(i + 1, false); }, intervaloMs || 7000);
    }
    function ir(k, manual){
      i = (k % total + total) % total;
      mostrar(i, manual);
      if(manual) programar();
    }
    raiz.addEventListener("mouseenter", function(){ sobre = true; programar(); });
    raiz.addEventListener("mouseleave", function(){ sobre = false; programar(); });
    raiz.addEventListener("focusin", function(){ enfocado = true; programar(); });
    raiz.addEventListener("focusout", function(e){
      if(!raiz.contains(e.relatedTarget)){ enfocado = false; programar(); }
    });
    if(reduceMotion.addEventListener) reduceMotion.addEventListener("change", programar);
    mostrar(0, false);
    programar();
    return {
      siguiente: function(){ ir(i + 1, true); },
      anterior: function(){ ir(i - 1, true); },
      ir: function(k){ ir(k, true); },
      pausar: function(v){ pausado = v; programar(); },
      estaPausado: function(){ return pausado; },
      rotaSolo: function(){ return total > 1 && !reduceMotion.matches; }
    };
  }

  /* ---------- 1. Banner de anuncios ---------- */
  (function(){
    var raiz = document.getElementById("anuncio");
    var cont = document.getElementById("anuncioMsgs");
    var msgs = (C.anuncios && C.anuncios.mensajes) || [];
    var cerrado = false;
    try{ cerrado = sessionStorage.getItem("landing-anuncio-cerrado") === "1"; }catch(e){}
    if(!raiz || !msgs.length || cerrado) return;
    var nodos = msgs.map(function(m){ var p = el("p", {"class":"anuncio-msg", "aria-hidden":"true"}, m); cont.appendChild(p); return p; });
    raiz.hidden = false;
    var sig = document.getElementById("anuncioSig");
    if(msgs.length < 2) sig.hidden = true;
    var rot = crearRotador(raiz, msgs.length, function(i, manual){
      nodos.forEach(function(n, k){
        n.classList.toggle("activo", k === i);
        n.setAttribute("aria-hidden", k === i ? "false" : "true");
      });
      cont.setAttribute("aria-live", manual ? "polite" : "off");
    }, C.anuncios.intervaloMs);
    sig.addEventListener("click", rot.siguiente);
    document.getElementById("anuncioCerrar").addEventListener("click", function(){
      rot.pausar(true);
      raiz.remove();
      try{ sessionStorage.setItem("landing-anuncio-cerrado", "1"); }catch(e){}
      var destino = document.querySelector(".barra .marca");
      if(destino) destino.focus();
    });
  })();

  /* ---------- 6. Carrusel de casos de uso ---------- */
  (function(){
    var raiz = document.getElementById("carrusel");
    var slides = document.getElementById("carSlides");
    var puntos = document.getElementById("carPuntos");
    var casos = (C.casosDeUso && C.casosDeUso.casos) || [];
    if(!raiz || !casos.length){ if(raiz) raiz.closest("section").hidden = true; return; }
    var total = casos.length;
    var nodos = casos.map(function(c, k){
      var art = el("article", {"class":"caso", "role":"group", "aria-roledescription":"caso", "aria-label":(k + 1) + " de " + total + ": " + c.titulo});
      if(C.casosDeUso.etiqueta) art.appendChild(el("span", {"class":"caso-tag"}, C.casosDeUso.etiqueta));
      art.appendChild(el("p", {"class":"caso-perfil"}, c.perfil));
      art.appendChild(el("h3", null, c.titulo));
      art.appendChild(el("p", {"class":"caso-sit"}, c.situacion));
      if(c.enLaHerramienta && c.enLaHerramienta.length){
        art.appendChild(el("p", {"class":"caso-sub"}, "En la herramienta"));
        var ul = el("ul");
        c.enLaHerramienta.forEach(function(t){ ul.appendChild(el("li", null, t)); });
        art.appendChild(ul);
      }
      slides.appendChild(art);
      return art;
    });
    var botones = casos.map(function(c, k){
      var b = el("button", {"type":"button", "class":"car-punto", "aria-label":"Caso " + (k + 1) + ": " + c.perfil});
      b.addEventListener("click", function(){ rot.ir(k); });
      puntos.appendChild(b);
      return b;
    });
    var pausa = document.getElementById("carPausa");
    var rot = crearRotador(raiz, total, function(i, manual){
      nodos.forEach(function(n, k){
        var activo = k === i;
        n.classList.toggle("activo", activo);
        n.setAttribute("aria-hidden", activo ? "false" : "true");
        if("inert" in n) n.inert = !activo;
      });
      botones.forEach(function(b, k){ b.setAttribute("aria-current", k === i ? "true" : "false"); });
      slides.setAttribute("aria-live", manual ? "polite" : "off");
    }, C.casosDeUso.intervaloMs);
    document.getElementById("carAnt").addEventListener("click", rot.anterior);
    document.getElementById("carSig").addEventListener("click", rot.siguiente);
    function actualizarPausa(){
      pausa.hidden = !rot.rotaSolo();
      var p = rot.estaPausado();
      pausa.setAttribute("aria-pressed", p ? "true" : "false");
      pausa.setAttribute("aria-label", p ? "Reanudar rotación" : "Pausar rotación");
    }
    pausa.addEventListener("click", function(){ rot.pausar(!rot.estaPausado()); actualizarPausa(); });
    if(reduceMotion.addEventListener) reduceMotion.addEventListener("change", actualizarPausa);
    actualizarPausa();
  })();

  /* ---------- 7. Precios ---------- */
  var planes = (C.precios && C.precios.planes || []).slice(0, 3);
  (function(){
    var cont = document.getElementById("planes");
    var etiqueta = document.getElementById("preciosEtiqueta");
    if(C.precios && C.precios.etiqueta && etiqueta) etiqueta.textContent = C.precios.etiqueta;
    if(!cont) return;
    function conPorDefinir(nodo, texto){
      var partes = String(texto).split("POR DEFINIR");
      partes.forEach(function(p, k){
        if(p) nodo.appendChild(document.createTextNode(p));
        if(k < partes.length - 1) nodo.appendChild(el("span", {"class":"por-definir"}, "POR DEFINIR"));
      });
      return nodo;
    }
    planes.forEach(function(p){
      var art = el("article", {"class":"plan" + (p.destacado ? " destacado" : ""), "aria-labelledby":"plan-" + p.id});
      if(p.destacado) art.appendChild(el("span", {"class":"plan-badge"}, "Recomendado"));
      art.appendChild(el("h3", {"class":"plan-nombre", "id":"plan-" + p.id}, p.nombre));
      art.appendChild(conPorDefinir(el("p", {"class":"plan-precio"}), p.precio));
      art.appendChild(el("p", {"class":"plan-periodo"}, p.periodo || ""));
      if(p.descripcion) art.appendChild(el("p", {"class":"plan-desc"}, p.descripcion));
      var ul = el("ul");
      (p.incluye || []).forEach(function(t){
        ul.appendChild(conPorDefinir(el("li", t.indexOf("POR DEFINIR") >= 0 ? {"class":"pendiente"} : null), t));
      });
      art.appendChild(ul);
      var a = el("a", {"class":"btn btn-bloque", "href":"#registro", "data-plan":p.id, "aria-label":"Probar la herramienta, plan " + p.nombre}, "Probar la herramienta");
      art.appendChild(a);
      cont.appendChild(art);
    });
  })();

  /* ---------- 9. Formulario ---------- */
  (function(){
    var form = document.getElementById("formRegistro");
    if(!form) return;
    var nombre = document.getElementById("fNombre");
    var correo = document.getElementById("fCorreo");
    var plan = document.getElementById("fPlan");
    var estado = document.getElementById("formEstado");

    planes.forEach(function(p){ plan.appendChild(el("option", {"value":p.id}, p.nombre)); });
    plan.appendChild(el("option", {"value":"no-se"}, "Aún no lo sé"));

    // Botones de cada plan: seleccionan el plan en el formulario
    document.addEventListener("click", function(e){
      var a = e.target.closest && e.target.closest("a[data-plan]");
      if(!a) return;
      plan.value = a.getAttribute("data-plan");
      validarCampo(plan);
      setTimeout(function(){ nombre.focus({preventScroll:true}); }, reduceMotion.matches ? 0 : 400);
    });

    var MENSAJES = {
      fNombre: function(i){ return i.validity.valueMissing ? "Escriba su nombre." : (i.validity.tooShort ? "El nombre debe tener al menos 2 caracteres." : ""); },
      fCorreo: function(i){ return i.validity.valueMissing ? "Escriba su correo electrónico." : (i.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value) ? "Escriba un correo válido, por ejemplo nombre@entidad.gov.co." : ""); },
      fPlan: function(i){ return i.validity.valueMissing ? "Seleccione un plan de interés." : ""; }
    };
    function validarCampo(i){
      if(i.id === "fNombre") i.value = i.value.replace(/^\s+/, "");
      var msg = MENSAJES[i.id](i);
      var err = document.getElementById("e" + i.id.slice(1));
      err.textContent = msg;
      if(msg) i.setAttribute("aria-invalid", "true"); else i.removeAttribute("aria-invalid");
      return !msg;
    }
    [nombre, correo, plan].forEach(function(i){
      i.addEventListener("blur", function(){ if(i.value || i.hasAttribute("aria-invalid")) validarCampo(i); });
      i.addEventListener("input", function(){ if(i.hasAttribute("aria-invalid")) validarCampo(i); });
    });

    form.addEventListener("submit", function(e){
      e.preventDefault();
      nombre.value = nombre.value.trim();
      correo.value = correo.value.trim();
      var invalidos = [nombre, correo, plan].filter(function(i){ return !validarCampo(i); });
      if(invalidos.length){
        estado.textContent = "Revise los campos marcados.";
        invalidos[0].focus();
        return;
      }
      // No se crea cuenta, no se guarda nada y no se envían datos:
      // la herramienta actual no tiene registro ni acepta datos precargados.
      estado.textContent = "Abriendo la herramienta…";
      form.reset();
      window.location.assign(C.destinoFormulario);
    });
  })();
})();
