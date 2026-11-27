(function () {
  const cuerpo = document.getElementById("cuerpo");
  const busqueda = document.getElementById("busqueda");
  const conteo = document.getElementById("conteo");
  const vacio = document.getElementById("vacio");
  const sinResultado = document.getElementById("sinResultado");
  const tablaWrap = document.getElementById("tablaWrap");
  const herramientas = document.getElementById("herramientas");

  document.querySelectorAll("[data-curso]").forEach(function (nodo) {
    nodo.textContent = CURSO.nombre;
  });

  function texto(valor) {
    return String(valor || "").trim();
  }

  function escapar(valor) {
    return texto(valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizar(valor) {
    return texto(valor)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function nombreCompleto(est) {
    return (texto(est.nombre) + " " + texto(est.apellido)).replace(/\s+/g, " ").trim();
  }

  function planilla() {
    return (Array.isArray(ESTUDIANTES) ? ESTUDIANTES : []).map(function (est, index) {
      return {
        nombre: texto(est.nombre),
        apellido: texto(est.apellido),
        codigo: texto(est.codigo),
        archivo: texto(est.archivo),
        index: index,
      };
    });
  }

  function visibles() {
    const q = normalizar(busqueda.value);
    return planilla()
      .filter(function (est) {
        if (!q) return true;
        const bolsa = normalizar(est.nombre + " " + est.apellido + " " + est.codigo);
        return bolsa.indexOf(q) !== -1;
      })
      .sort(function (a, b) {
        const porApellido = normalizar(a.apellido).localeCompare(normalizar(b.apellido), "es");
        if (porApellido !== 0) return porApellido;
        return normalizar(a.nombre).localeCompare(normalizar(b.nombre), "es");
      });
  }

  function iconoDescarga() {
    return (
      '<svg class="btn__icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 4v11"></path><path d="M7 11l5 5 5-5"></path><path d="M5 19h14"></path></svg>'
    );
  }

  function pintar() {
    const todos = planilla();
    const lista = visibles();
    const hayPlanilla = todos.length > 0;

    herramientas.hidden = !hayPlanilla;
    vacio.hidden = hayPlanilla;
    sinResultado.hidden = !hayPlanilla || lista.length > 0;
    tablaWrap.hidden = !hayPlanilla || lista.length === 0;

    if (!hayPlanilla) {
      conteo.textContent = "";
      cuerpo.innerHTML = "";
      return;
    }

    conteo.textContent =
      lista.length === todos.length
        ? todos.length === 1
          ? "1 estudiante"
          : todos.length + " estudiantes"
        : lista.length + " de " + todos.length + " estudiantes";

    cuerpo.innerHTML = lista
      .map(function (est) {
        const completo = nombreCompleto(est) || "Estudiante";
        return (
          "<tr>" +
          '<td data-label="Nombre">' + escapar(est.nombre || "—") + "</td>" +
          '<td data-label="Apellido">' + escapar(est.apellido || "—") + "</td>" +
          '<td data-label="Código"><span class="codigo">' + escapar(est.codigo || "—") + "</span></td>" +
          "<td>" +
          '<a class="btn btn--primary btn--sm" href="' + escapar(est.archivo) + '" target="_blank" rel="noopener noreferrer" aria-label="Abrir el certificado de ' + escapar(completo) + ' en otra pestaña">' +
          iconoDescarga() +
          "Descargar</a></td></tr>"
        );
      })
      .join("");
  }

  busqueda.addEventListener("input", pintar);
  pintar();
})();
