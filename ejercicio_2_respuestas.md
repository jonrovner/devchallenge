### Preguntas

1. ¿Cómo implementarías las acciones del frontend utilizando redux? (por ejemplo autenticación, solicitud de clientes activos para el usuario y solicitud de casos por cliente)

Para implementar Redux primero tenemos que instalarlo con ```npm install redux react-redux redux-thunk```, luego crearemos un directorio 'redux' con tres archivos: actions.js, store.js y reducers.js. 
Si quisiéramos implementar login, solicitud de clientes y solicitud de casos con redux tendríamos que definir acciones en el archivo actions.js de la siguiente manera:

```js
//actions.js

export const login = (credentials) => async (dispatch) => {
  try {
    let user = await axios.post(`/login`, credentials);
    return dispatch({ type: 'login', payload: user.data });
  } catch (error) {
    console.log(error);
  }
};

export const get_Clients = ( auth ) => async (dispatch) => {
  try {
    let response = await axios.get(`/api/v1/clients/`, {headers: auth});
    return dispatch({ type: 'get_clients', payload: response.data });
  } catch (error) {
    console.log(error);
  }
};
export const get_Cases = (id, start, end, auth) => async (dispatch) => {
  try {
    const url = `/api/v1/inbound-case/?client=${id}&local_updated__date__gte:${start}&local_updated__date__lte=${end}`
    let response = await axios.get(url, {headers: auth});
    return dispatch({ type: 'get_cases', payload: response.data });
  } catch (error) {
    console.log(error);
  }
};
```

en el reducer, tendríamos un initialState que contendría las propiedades 'user', 'clients' y 'cases' en donde guardaremos el resultado de invocar la acción respectiva.

```js
//reducers.js

const initialState = {
  user: {},
  clients:{},
  cases:{}
};

function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'login': {
      return {
        ...state,
        user: payload,
      };
    case 'ger_clients': {
      return {
        ...state,
        clients: payload,
      };
    case 'get_cases': {
      return {
        ...state,
        cases: payload,
      };
    }
```

Y por último configuramos el store, que será importado en en el archivo index.js para ser pasado como prop a toda la app, a través de un componente padre. 

```js
//store.js

import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducer/index";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;

```
Típicamente la estructura del index.js para una app con redux sería la siguiente... 

```js
//index.js

  <Provider store={store}>
        
    <App />
      
  </Provider>
```

2. Si quisiéramos agregar una ruta nueva a la app, ¿cómo reestructurarías el index.js?

Para agregar rutas tendríamos que instalar React Router y react-router-dom.
El index.js quedaría estructurado del siguiente modo:

```js
//index.js

  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
```

