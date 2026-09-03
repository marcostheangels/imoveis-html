# Pasta de Imagens

Esta pasta está organizada para armazenar as imagens dos imóveis localmente.

## Estrutura

```
images/
├── apartamentos/    # Fotos de apartamentos e coberturas
├── casas/          # Fotos de casas, sobrados e chácaras
├── comercial/      # Fotos de salas comerciais
├── terrenos/       # Fotos de terrenos
└── logo/           # Logo e imagens da marca
```

## Como usar imagens locais

Para usar imagens locais ao invés de URLs externas, edite o arquivo `js/data.js` e troque as URLs por caminhos relativos, por exemplo:

```javascript
images: [
    "images/apartamentos/apt-01-foto1.jpg",
    "images/apartamentos/apt-01-foto2.jpg",
    "images/apartamentos/apt-01-foto3.jpg"
]
```

## Formatos recomendados

- Formato: JPG ou WebP
- Tamanho: 800x600px ou maior
- Compressão: 80-90% para web
