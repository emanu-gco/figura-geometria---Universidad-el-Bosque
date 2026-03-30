# Análisis Geométrico de Polígonos 📐

Este proyecto es una herramienta interactiva diseñada para visualizar polígonos regulares y analizar sus propiedades matemáticas de forma dinámica. Está construido con **Vanilla JavaScript** y utiliza **SVG** para el renderizado de gráficos.

## 🚀 Funcionalidades

- **Visualización Dinámica:** Ajusta el número de lados ($n$) del polígono (desde 3 hasta 20).
- **Cálculo de Diagonales:** Visualiza todas las diagonales posibles y calcula el total basado en fórmulas geométricas.
- **Puntos Medios:** Identifica y marca los puntos medios de cada lado.
- **Resultados Analíticos:** Muestra el nombre del polígono y datos precisos sobre sus vértices y diagonales.

## 🧠 ¿Cómo funciona el código?

### 1. Geometría y Trigonometría
Para dibujar un polígono regular, el código utiliza funciones trigonométricas para calcular las coordenadas $(x, y)$ de cada vértice sobre una circunferencia imaginaria:
- **Fórmula:** $x = cx + r \cdot \cos(a)$ y $y = cy + r \cdot \sin(a)$
- Se distribuyen los vértices uniformemente dividiendo $360^\circ$ ($2\pi$ radianes) entre el número de lados $n$.

### 2. Teoremas Aplicados
El panel de resultados utiliza fórmulas estándar de geometría:
- **Diagonales desde un vértice:** $d = n - 3$
- **Total de diagonales:** $D = \frac{n(n - 3)}{2}$

### 3. Renderizado con SVG
En lugar de un Canvas de píxeles, se utiliza **SVG (Scalable Vector Graphics)**. Esto permite que el polígono se vea nítido en cualquier resolución y que podamos manipular cada línea, círculo y texto como un objeto independiente del DOM.

## 🛠️ Tecnologías utilizadas

- **HTML5 & CSS3:** Estructura y diseño moderno con CSS Variables.
- **JavaScript (ES6+):** Lógica matemática y manipulación del DOM.
- **Parcel:** Empaquetador (bundler) para optimizar el código para producción.
- **GitHub Actions:** Despliegue automatizado a GitHub Pages.

---
*Proyecto desarrollado para el laboratorio de Geometría - Primer Semestre.*
