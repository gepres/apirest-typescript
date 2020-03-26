# API REST CON TYPESCRIPT
* [link de hekoru]()

Esta es una api rest con typescript.

* nodejs version v12.13.1
* mongodb  v4.2.2
* typescript v3.8.3
* cloudinary
* jwt


## UTILIZAR
* npm run dev || para desarrollo
* npm start || para produción

## END POINT

*endpoint => metodo || descripción*

**FOTOS**

* /api/photo => get ||lista de fotos(publico)
* /api/photo/:id => get || consulta de un foto (publico)
* /api/photo/ => post || agregar foto (auntenticación)
* /api/photo/:id => put || actualizar foto(auntenticación)
* /api/photo/:id => delete || eliminar foto(auntenticación)

**USUARIO**

* /api/auth/signup => post || registrarse(publico)
* /api/photo/signin => post ||login(publico)

### CONFIGURACIÓN

* npm init
* npx tsc --init

**instalar dependencias**

* npm i express cross-env dotenv cloudinary fs-extra mongoose morgan multer shortid cors express-validator jsonwebtoken bcrypt
* npm i typescript nodemon ts-node @types/express  @types/fs-extra  @types/mongoose  @types/morgan  @types/multer  @types/shortid @types/cors @types/jsonwebtoken @types/bcrypt  -D

**configuración de archivos**

* crea carpeta src , dentro las carpetas models, controllers,routes,middlewares
* crea la carpeta uplodas para las imagenes
* crea un archivo nodemon.json , escribe

```js
{
  "watch":[
    "src"
  ],
  "ext":"ts",
  "ingore":[
   "src/**/*.spec.ts" 
  ],
  "exec":"ts-node ./src/index.ts"
}

```

* configura el archivo tsconfig.json

```js
"target": "es6",
//
"outDir": "./dist/",
"rootDir": "./src/", 
// 
"moduleResolution": "node",
//
"typeRoots": [
  "./custom_typings",
  "./node_modules/@types"
], 
//
"include":[
    "./src**/*"
  ],
  "exclude": [
    "node_modules"
],
// "files":["types.d.ts"]
```

* archivo index.d.ts en la carpeta custom_typings/express || para el req
* o tambien un types.d.ts  el base de proyecto y descomenta el files de tsconfig
```js
declare namespace Express {
  interface Request {
    userId: string;
  }
}
```


* archivo .env  || variables de entorno

```js
MONGODB_URI = ruta de mongo atlas
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 
SECRET_KEY = 
```

* script de package.json

```js
  "ts:node": "ts-node src/index.ts",
  "clean": "rm -rf dist",
  "build": "tsc",
  "start": "cross-env NODE_ENV=production npm run build && node dist/index.js",
  "dev": "cross-env NODE_ENV=development nodemon"
```