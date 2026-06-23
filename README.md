# Timeline Histórico

Visualización interactiva de vidas de personajes históricos famosos, mostrando quiénes fueron contemporáneos.

Inspirado en [history-timeline](https://github.com/ybogdanov/history-timeline) de ybogdanov.

## Stack

- D3.js v7
- HTML / CSS / JavaScript vanilla
- GitHub Pages

## Ejecutar localmente

Abrir `index.html` con un servidor local (necesario para cargar el JSON):

```bash
npx serve .
# o
python3 -m http.server 8080
```

## Estructura

```
index.html
public/
  css/main.css
  js/main.js
  data/people.json
```

## Datos

`public/data/people.json` contiene la lista de personas con `name`, `born`, `died` y `category`.
