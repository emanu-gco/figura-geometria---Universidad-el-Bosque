/**
 * Análisis Geométrico de Polígonos
 * 
 * Hola, somos estudiantes desarrolladores de este código. En este archivo nos encargamos
 * de dibujar el polígono y calcular sus propiedades matemáticas de forma dinámica.
 * Usaremos Vanilla JS y un poco de trigonometría básica. La idea es que todo
 * funcione de manera clara para poder explicarlo.
 */

// Nombres comunes para los polígonos, desde el triángulo (n=3) hasta el icoságono (n=20).
const nombresPoligonos = {
  3: "Triángulo", 4: "Cuadrilátero", 5: "Pentágono", 6: "Hexágono",
  7: "Heptágono", 8: "Octágono", 9: "Nonágono", 10: "Decágono",
  11: "Undecágono", 12: "Dodecágono", 15: "Pentadecágono", 20: "Icoságono"
};

// --- REFERENCIAS AL DOM ---
// Aquí obtenemos todos los elementos HTML con los que vamos a interactuar en la UI.
const inputRangeN = document.getElementById("n-sides");
const inputNumberN = document.getElementById("n-number");
const spanNVal = document.getElementById("n-val-display");

const chkDiagonales = document.getElementById("chk-diagonals");
const chkPuntosMedios = document.getElementById("chk-midpoints");

const svgCanvas = document.getElementById("poly-canvas");

// Referencias a los campos de la tabla de resultados para inyectar los valores
const resName = document.getElementById("poly-name");
const resVertices = document.getElementById("poly-vertices");
const resDiag1v = document.getElementById("diag-1v");
const resDiagTotal = document.getElementById("diag-total");

// --- FUNCIONES MATEMÁTICAS / GEOMÉTRICAS ---

/**
 * Calculamos las coordenadas (x, y) de los vértices de un polígono regular.
 * Utilizamos las funciones trigonométricas seno y coseno para distribuir los puntos
 * uniformemente a lo largo de una circunferencia imaginaria (circunscrita).
 */
function calcularVertices(n, radio, centroX, centroY) {
  const vertices = [];
  // Para que el polígono quede visualmente "de pie" (con un lado o vértice apuntando recto),
  // comienzo el ángulo en -PI/2 (que equivale a -90 grados, en la parte superior).
  const anguloInicial = -Math.PI / 2;

  for (let i = 0; i < n; i++) {
    const angulo = anguloInicial + (2 * Math.PI * i) / n;
    // La fórmula paramétrica de una circunferencia: x = cx + r*cos(a), y = cy + r*sin(a)
    const x = centroX + radio * Math.cos(angulo);
    const y = centroY + radio * Math.sin(angulo);
    vertices.push({ x, y });
  }
  return vertices;
}

/**
 * Calculamos el punto medio exacto entre dos coordenadas cartesianas dadas.
 */
function obtenerPuntoMedio(v1, v2) {
  return {
    x: (v1.x + v2.x) / 2,
    y: (v1.y + v2.y) / 2
  };
}

/**
 * Pequeña función auxiliar para crear elementos SVG directamente desde JS.
 * Como el SVG requiere un "namespace" especial, no podemos usar un createElement normal de HTML.
 */
function crearElementoSVG(etiqueta, atributos = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", etiqueta);
  for (const [key, value] of Object.entries(atributos)) {
    el.setAttribute(key, value);
  }
  return el;
}

// --- DIBUJADO EN EL CANVAS ---

/**
 * Función principal que orquesta el dibujo en el SVG. 
 * Se llamará cada vez que modifique un parámetro en la interfaz.
 */
function actualizarVista() {
  const n = parseInt(inputRangeN.value);
  const mostrarDiagonales = chkDiagonales.checked;
  const mostrarPuntosMedios = chkPuntosMedios.checked;

  // Actualizar los inputs para que estén sincronizados entre sí
  inputNumberN.value = n;
  spanNVal.textContent = `n = ${n}`;

  // Actualizar la tabla analítica con las fórmulas de geometría
  actualizarTablaMatematica(n);

  // Limpiar el canvas para el nuevo dibujo
  svgCanvas.innerHTML = "";

  // Configuraciones de dimensiones del lienzo
  const width = 600;
  const height = 500;
  const cx = width / 2;
  const cy = height / 2;
  const radio = 180; // Radio de la circunferencia inscrita

  // 1. Obtener las coordenadas cartesianas de todos los vértices
  const vertices = calcularVertices(n, radio, cx, cy);

  // 2. DIBUJAR DIAGONALES (si la casilla está marcada)
  if (mostrarDiagonales) {
    // Para no repetir diagonales y hacer un código eficiente, iteramos:
    // desde el vértice i hasta el vértice j (donde j es al menos i+2).
    for (let i = 0; i < n; i++) {
      for (let j = i + 2; j < n; j++) {
        // Evitar conectar el primero y el último porque eso es un lado, no una diagonal
        if (i === 0 && j === n - 1) continue;

        const linea = crearElementoSVG("line", {
          x1: vertices[i].x, y1: vertices[i].y,
          x2: vertices[j].x, y2: vertices[j].y,
          stroke: "var(--color-diagonal)",
          "stroke-width": "1.5",
          opacity: "0.4" // Un poco transparentes para que el contorno resalte
        });
        svgCanvas.appendChild(linea);
      }
    }
  }

  // 3. DIBUJAR PUNTOS MEDIOS (si la casilla está marcada)
  const puntosMedios = [];
  if (mostrarPuntosMedios) {
    // Calculamos primero todos los puntos medios de los lados
    for (let i = 0; i < n; i++) {
      const pActual = vertices[i];
      const pSiguiente = vertices[(i + 1) % n]; // El módulo % n asegura que el último conecte con el primero formando un ciclo
      puntosMedios.push(obtenerPuntoMedio(pActual, pSiguiente));
    }

    // Dibujar los circulitos que representan los puntos medios
    puntosMedios.forEach(pm => {
      const circulo = crearElementoSVG("circle", {
        cx: pm.x, cy: pm.y, r: "5",
        fill: "var(--color-midpoint)"
      });
      svgCanvas.appendChild(circulo);
    });
  }

  // 4. DIBUJAR EL CONTORNO (LOS LADOS) DEL POLÍGONO
  // Construimos el string con todos los puntos para la etiqueta <polygon> de SVG
  const puntosStr = vertices.map(v => `${v.x},${v.y}`).join(" ");
  const poligono = crearElementoSVG("polygon", {
    points: puntosStr,
    fill: "transparent", // Sin relleno para ver bien las diagonales
    stroke: "var(--color-side)",
    "stroke-width": "2.5",
    "stroke-linejoin": "round"
  });
  svgCanvas.appendChild(poligono);

  // 5. DIBUJAR LOS VÉRTICES Y SUS NOMBRES
  // Los dibujamos al final para que queden sobre los lados y líneas y no se tapen.
  vertices.forEach((v, i) => {
    const circulo = crearElementoSVG("circle", {
      cx: v.x, cy: v.y, r: "6",
      fill: "var(--color-vertex)"
    });
    svgCanvas.appendChild(circulo);
    
    // Matemática vectorial básica para colocar los textos (V1, V2...) un poco alejados del vértice
    const labelDist = 20;
    const dx = v.x - cx;
    const dy = v.y - cy;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    const labelX = v.x + (dx / len) * labelDist;
    const labelY = v.y + (dy / len) * labelDist + 4; // Ajuste menor en Y para centrar el texto

    const text = crearElementoSVG("text", {
      x: labelX, y: labelY,
      "text-anchor": "middle",
      "font-family": "Inter, sans-serif",
      "font-size": "12px",
      "font-weight": "600",
      fill: "var(--color-vertex)"
    });
    text.textContent = `V${i + 1}`;
    svgCanvas.appendChild(text);
  });
}

/**
 * Calculamos y mostramos todos los teoremas que aplicamos.
 */
function actualizarTablaMatematica(n) {
  // Asignar el nombre del polígono o colocar n-ágono si es mayor.
  const nombre = nombresPoligonos[n] || `${n}-ágono`;
  resName.textContent = nombre;
  resVertices.textContent = n;

  // Teorema 2: Diagonales trazadas desde 1 solo vértice (D = n - 3)
  const d1v = Math.max(0, n - 3); 
  resDiag1v.textContent = d1v;

  // Teorema 3: Total de Diagonales del polígono (D = n(n - 3) / 2)
  const dTotal = (n * (n - 3)) / 2;
  resDiagTotal.textContent = dTotal;
}

// --- EVENT LISTENERS ---
// Conectamos las acciones del usuario con la función principal para que sea reactivo.
inputRangeN.addEventListener("input", actualizarVista);

// Permitir que si escriben un número manualmente, el slider también se actualice
inputNumberN.addEventListener("input", (e) => {
  let val = parseInt(e.target.value);
  // Limitamos a los valores lógicos, mínimo 3 lados (no existe polígono de 2 lados)
  if (isNaN(val) || val < 3) val = 3;
  if (val > 50) val = 50; // Límite por sanidad para no colapsar el dibujado del navegador
  inputRangeN.value = val;
  actualizarVista();
});

chkDiagonales.addEventListener("change", actualizarVista);
chkPuntosMedios.addEventListener("change", actualizarVista);

// --- INICIALIZACIÓN ---
// Llamamos a la función una vez al cargar la página para que se dibuje el estado inicial.
actualizarVista();
