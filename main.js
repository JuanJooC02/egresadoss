// SECCIÓN MAPA MUNDIAL Y COLOMBIA
const interiorPanel = document.getElementById('interiorPanel');
document.getElementById('botonVerColombia').addEventListener('click', () => {
  interiorPanel.classList.add('girado');
});
document.getElementById('botonVerMundo').addEventListener('click', () => {
  interiorPanel.classList.remove('girado');
});

const datosEgresadosMundo = {
  "US": { nombre: "Estados Unidos", egresados: 16 },
  "CA": { nombre: "Canadá", egresados: 11 },
  "DE": { nombre: "Alemania", egresados: 6 },
  "ES": { nombre: "España", egresados: 6 },
  "PE": { nombre: "Perú", egresados: 6 },
  "AU": { nombre: "Australia", egresados: 5 },
  "MX": { nombre: "México", egresados: 5 },
  "DO": { nombre: "República Dominicana", egresados: 3 },
  "PA": { nombre: "Panamá", egresados: 2 },
  "IT": { nombre: "Italia", egresados: 2 },
  "BO": { nombre: "Bolivia", egresados: 1 },
  "CR": { nombre: "Costa Rica", egresados: 1 },
  "JP": { nombre: "Japón", egresados: 1 },
  "EC": { nombre: "Ecuador", egresados: 1 },
  "NL": { nombre: "Países Bajos", egresados: 1 },
  "MT": { nombre: "Malta", egresados: 1 },
  "CL": { nombre: "Chile", egresados: 1 }
};

fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  .then(respuesta => respuesta.json())
  .then(datosMapaMundo => {
    const paises = topojson.feature(datosMapaMundo, datosMapaMundo.objects.countries).features;
    const ancho = 1000, alto = 500;
    const proyeccion = d3.geoMercator().scale(130).translate([ancho / 2, alto / 1.5]);
    const generadorCaminos = d3.geoPath().projection(proyeccion);

    const equivalenciasIso = {
      "840": "US", "124": "CA", "276": "DE", "724": "ES", "604": "PE",
      "036": "AU", "484": "MX", "214": "DO", "591": "PA", "380": "IT",
      "068": "BO", "188": "CR", "392": "JP", "218": "EC", "528": "NL",
      "470": "MT", "152": "CL"
    };

    const contenedor = d3.select("#contenedorMapaMundo");
    contenedor.selectAll("*").remove();

    const lienzoSvg = contenedor.append("svg").attr("viewBox", `0 0 ${ancho} ${alto}`);
    const cuadroFlotante = d3.select("#cuadroFlotanteMundo");
    const mapaDerecha = document.getElementById("mapaDerechaMundo");

    lienzoSvg.selectAll("path")
      .data(paises).enter().append("path")
      .attr("d", generadorCaminos)
      .attr("id", elemento => equivalenciasIso[elemento.id] || `pais-${elemento.id}`)
      .on("mouseover", (evento, elemento) => {
        const codigoIso = equivalenciasIso[elemento.id];
        if (datosEgresadosMundo[codigoIso]) {
          cuadroFlotante.style("display", "block")
            .html(`<strong>${datosEgresadosMundo[codigoIso].nombre}</strong><br/>🎓 Egresados: ${datosEgresadosMundo[codigoIso].egresados.toLocaleString()}`);
        }
      })
      .on("mousemove", (evento) => {
        const bordes = mapaDerecha.getBoundingClientRect();
        cuadroFlotante.style("left", (evento.clientX - bordes.left + 10) + "px")
                      .style("top", (evento.clientY - bordes.top + 10) + "px");
      })
      .on("mouseout", () => cuadroFlotante.style("display", "none"))
      .on("click", (evento, elemento) => {
        const codigoIso = equivalenciasIso[elemento.id];
        const panelDetalle = document.getElementById("panelDetalleMundo");
        if (datosEgresadosMundo[codigoIso]) {
          document.getElementById("nombrePaisDetalle").innerText = datosEgresadosMundo[codigoIso].nombre;
          document.getElementById("cantidadEgresadosMundo").innerText = datosEgresadosMundo[codigoIso].egresados.toLocaleString();
          panelDetalle.style.display = "block";
        } else {
          panelDetalle.style.display = "none";
        }
      });
  });

fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json')
  .then(respuesta => respuesta.json())
  .then(datosMapaDetallado => {
    const paises = topojson.feature(datosMapaDetallado, datosMapaDetallado.objects.countries).features;
    const colombiaGeometria = paises.find(pais => pais.id === "170");

    const ancho = 1000, alto = 500;
    const proyeccion = d3.geoMercator()
      .fitExtent([[80, 20], [ancho - 80, alto - 20]], colombiaGeometria);

    const generadorCaminos = d3.geoPath().projection(proyeccion);

    const contenedor = d3.select("#contenedorMapaColombia");
    contenedor.selectAll("*").remove();

    const lienzoSvg = contenedor.append("svg").attr("viewBox", `0 0 ${ancho} ${alto}`);
    const cuadroFlotante = d3.select("#cuadroFlotanteColombia");
    const mapaDerecha = document.getElementById("mapaDerechaColombia");

    lienzoSvg.append("path")
      .datum(colombiaGeometria)
      .attr("d", generadorCaminos)
      .attr("fill", "#f1f5f9")
      .attr("stroke", "#0e1f87")
      .attr("stroke-width", "1.5");

    const puntosDepartamentos = [
      { id: "DEP_DC", nombre: "Bogotá D.C.", egresados: 503, coordenadas: [-74.0721, 4.7110], radio: 30, color: "#0e1f87" },
      { id: "DEP_CUN", nombre: "Cundinamarca", egresados: 44, coordenadas: [-74.1300, 5.0200], radio: 18, color: "#e11d48" },
      { id: "DEP_ANT", nombre: "Antioquia", egresados: 9, coordenadas: [-75.5636, 6.2518], radio: 12, color: "#16a34a" },
      { id: "DEP_ATL", nombre: "Atlántico", egresados: 4, coordenadas: [-74.7813, 10.9685], radio: 9, color: "#06b6d4" },
      { id: "DEP_TOL", nombre: "Tolima", egresados: 3, coordenadas: [-75.2300, 4.4300], radio: 8, color: "#eab308" },
      { id: "DEP_MET", nombre: "Meta", egresados: 2, coordenadas: [-73.6300, 4.1400], radio: 7, color: "#a855f7" },
      { id: "DEP_CAS", nombre: "Casanare", egresados: 2, coordenadas: [-72.4000, 5.3300], radio: 7, color: "#64748b" },
      { id: "DEP_NAR", nombre: "Nariño", egresados: 1, coordenadas: [-77.2800, 1.2100], radio: 6, color: "#64748b" },
      { id: "DEP_SAN", nombre: "Santander", egresados: 1, coordenadas: [-73.1198, 7.1254], radio: 6, color: "#64748b" },
      { id: "DEP_BOL", nombre: "Bolívar", egresados: 1, coordenadas: [-75.5000, 10.4000], radio: 6, color: "#64748b" },
      { id: "DEP_VAC", nombre: "Valle del Cauca", egresados: 1, coordenadas: [-76.5225, 3.4372], radio: 6, color: "#64748b" },
      { id: "DEP_BOY", nombre: "Boyacá", egresados: 1, coordenadas: [-73.3600, 5.5300], radio: 6, color: "#64748b" }
    ];

    lienzoSvg.selectAll("circle")
      .data(puntosDepartamentos)
      .enter()
      .append("circle")
      .attr("cx", punto => proyeccion(punto.coordenadas)[0])
      .attr("cy", punto => proyeccion(punto.coordenadas)[1])
      .attr("r", punto => punto.radio)
      .attr("fill", punto => punto.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", "2")
      .attr("style", "cursor: pointer; opacity: 0.95;")
      .on("mouseover", (evento, punto) => {
        cuadroFlotante.style("display", "block")
          .html(`<strong>${punto.nombre}</strong><br/>🎓 Egresados: ${punto.egresados.toLocaleString()}`);
      })
      .on("mousemove", (evento) => {
        const bordes = mapaDerecha.getBoundingClientRect();
        cuadroFlotante.style("left", (evento.clientX - bordes.left + 10) + "px")
                      .style("top", (evento.clientY - bordes.top + 10) + "px");
      })
      .on("mouseout", () => cuadroFlotante.style("display", "none"))
      .on("click", (evento, punto) => {
        const panelDetalle = document.getElementById("panelDetalleColombia");
        document.getElementById("nombreDepartamentoDetalle").innerText = punto.nombre;
        document.getElementById("cantidadEgresadosColombia").innerText = punto.egresados.toLocaleString();
        panelDetalle.style.display = "block";
      });
  });

// SECCIÓN DE SECTORES ECONÓMICOS
const pistaSectores = document.getElementById('pistaCarruselSectores');
const botonAnteriorSectores = document.getElementById('botonAnteriorSectores');
const botonSiguienteSectores = document.getElementById('botonSiguienteSectores');
const anchoTarjetaSector = 290;

if (botonSiguienteSectores && botonAnteriorSectores) {
  botonSiguienteSectores.addEventListener('click', () => {
    pistaSectores.scrollBy({ left: anchoTarjetaSector, behavior: 'smooth' });
  });

  botonAnteriorSectores.addEventListener('click', () => {
    pistaSectores.scrollBy({ left: -anchoTarjetaSector, behavior: 'smooth' });
  });
}
