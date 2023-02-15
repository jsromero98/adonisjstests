import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from 'App/Models/Usuario'

export default class UsuariosController {

    public async getListarUsuarios(): Promise<Usuario[]> {
        const user = await Usuario.all()
        return user;
    }

    public async getListarUsuariosYPerfil(): Promise<Usuario[]>{
        const user = await Usuario.query().preload('perfil')
        return user
    }

    public async getListarUsuariosYPublicaciones(): Promise<Usuario[]>{
        const user = await Usuario.query().preload('publicaciones')
        return user
    }

    public async getListarUsuariosGrupos(): Promise<Usuario[]>{
        const user = await Usuario.query().preload('usuario_grupos')
        return user
    }

    public async setRegistrarUsuario({request,response}:HttpContextContract){
        const dataUsuario = request.only(['codigo_usuario','nombre_usuario','contrasena','email', 'telefono', 'perfil'])
        //console.log(dataUsuario)
        try {
            const codigoUsuario = dataUsuario.codigo_usuario
            const UsuarioExistente :Number = await this.getValidarUsuarioExistente(codigoUsuario)
            if (UsuarioExistente == 0){
                await Usuario.create(dataUsuario)
                response.status(200).json({'msg': 'Registro de Usuario completo.'})
            } else {
                response.status(400).json({'msg':'El codigo del Usuario ya se encuentra registrado.'})
            }
        }catch(error){
            console.log(error)
            response.status(500).json({'msg':'Error en el servidor.'})
        }
    }

    private async getValidarUsuarioExistente(codigo_usuario:Number): Promise<Number>{
        let total = await Usuario.query().where({'codigo_usuario':codigo_usuario}).count('*').from('usuarios')
        //console.log(total[0]['count'])
        return parseInt(total[0]['count'])
    }

    public async getUsuarioPorID({request}:HttpContextContract){
        const id = request.param('id');
        const user =  await Usuario.find(id);
        return user;
    }

    public async actualizarUsuario({ request, response}:HttpContextContract){
        const id = request.param('id');
        const datos = request.all();
        const usuario = await Usuario.findOrFail(id)
        usuario.nombre_usuario = datos.nombre_usuario
        usuario.contrasena = datos.contrasena
        usuario.email = datos.email
        usuario.telefono = datos.telefono
        await usuario.save()
        response.status(200).json({'msg': 'Registro actualizado.'})
    }

    public async eliminarUsuario({ request , response}: HttpContextContract){
        const id = request.param('id')
        await Usuario.query().where('codigo_usuario',id).delete();
        response.status(200).json({'msg': 'Registro eliminado.'})
    }

    public async getUsuarioPorNombre( {request}: HttpContextContract){
        const name = request.all()
        const users = await Usuario.query().where('nombre_usuario','like',`%${name}%`)
        return (users)
    }
}
