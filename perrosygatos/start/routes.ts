/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(()=>{
  Route.get('/listar-mascotas','MascotasController.getListarMascotas')
  Route.get('/listar-mascotas-por-especie','MascotasController.getListarMascotasPorEspecie')
  Route.get('/listar-mascotas-menor-8','MascotasController.getListarMascotasMenores8')

  Route.post('/registrar-mascota','MascotasController.setRegistrarMascota')

  Route.delete('/eliminar-mascota/','MascotasController.eliminarMascota')

  Route.put('/actualizar-mascota','MascotasController.actualizarMascota')
}).prefix('/tienda/v1')


