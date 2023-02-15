import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Publicacione from 'App/Models/Publicacione'

export default class PublicacionesController {

    public async setRegistrarPublicacion({request,response}:HttpContextContract){
        try {
            const dataPublicaciones = request.only(['codigo_publicacion','codigo_usuario','titulo','cuerpo'])
            const codigoPublicacion = dataPublicaciones.codigo_publicacion
            const PublicacionesExistente :Number = await this.getValidarPublicacionesExistente(codigoPublicacion)
            if (PublicacionesExistente === 0){
                await Publicacione.create(dataPublicaciones)
                response.status(200).json({'msg': 'Registro de Publicacion completo con exito.'})
            } else {
                response.status(400).json({'msg':'El codigo de publicacion ya se encuentra registrado.'})
            }
        }catch(error){
            console.log(error)
            response.status(500).json({'msg':'Error en el servidor.'})
        }
    }

    private async getValidarPublicacionesExistente(codigo_publicacion:Number): Promise<Number>{
        let total = await Publicacione.query().where({'codigo_publicacion':codigo_publicacion}).count('*').from('publicaciones')
        return parseInt(total[0]['count(*)'])
    }
}
