# U Camp Technical Test - Backend

API para realizar consultas al API de Mercado Libre

## URL Mercado libre

Using npm:

`https://api.mercadolibre.com/sites/MLA/search?q={query}`

## Servicios expuestos

```ts

// Definir la URL base del servidor donde se desplego el servicio
@contentType = application/json
@baseLoca = http://localhost:3700/

// Ejemplos de GET
GET {{baseLoca}}api/search?q=celular
Content-Type: {{contentType}}

GET {{baseLoca}}api/search?q=celular&sort=price_asc
Content-Type: {{contentType}}

GET {{baseLoca}}api/search?q=celular&sort=price_asc&price=*-25000.0
Content-Type: {{contentType}}

GET {{baseLoca}}api/search?q=celular&sort=price_asc&price=*-25000.0&limit=30&offset=0
Content-Type: {{contentType}}

GET {{baseLoca}}api/search/categories
Content-Type: {{contentType}}

GET {{baseLoca}}api/search/categories/MLA5725
Content-Type: {{contentType}}
```

## Puerto donde se ejcuta de forma local
`Archivo: .env`

```ts
PORT=3700
```
