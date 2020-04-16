# SmartSLA

## Project configuration

You can update the `public/env/openpaas.js` file to define the OpenPaaS instance to reach. Current environment variables are:

- `VUE_APP_OPENPAAS_URL`: route to your OpenPaaS instance. Needs to be `http://localhost:8080` in development mode.

- `SSP_URL`: route to the SSP to be used to reset user password. ie `https://ssp.localhost:8080` 


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### TESTS
 unit
```
npm run test:unit
```
end-to-end
```
npm run test:e2e
```
