import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Perfil from 'App/Models/Perfil'

export default class PerfilsController {

    public async setRegistrarPerfil({request,response}:HttpContextContract){
        try {
            const dataPerfil = request.only(['codigo_perfil','codigo_usuario','nombre_perfil','fecha_creacion'])
            const codigoPerfil = dataPerfil.codigo_perfil
            const perfilExistente :Number = await this.getValidarPerfilExistente(codigoPerfil)
            if (perfilExistente === 0){
                await Perfil.create(dataPerfil)
                response.status(200).json({'msg': 'Registro de perfil completo.'})
            } else {
                response.status(400).json({'msg':'El codigo del perfil ya se encuentra registrado.'})
            }
        }catch(error){
            console.log(error)
            response.status(500).json({'msg':'Error en el servidor.'})
        }
    }

    private async getValidarPerfilExistente(codigo_perfil:Number): Promise<Number>{
        let total = await Perfil.query().where({'codigo_perfil':codigo_perfil}).count('*').from('perfils')
        return parseInt(total[0]['count(*)'])
    }

}
