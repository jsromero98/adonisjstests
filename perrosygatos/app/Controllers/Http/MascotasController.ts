import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mascota from 'App/Models/Mascota';

export default class MascotasController {

    public async getListarMascotas(): Promise<Mascota[]> {
        const mascota = await Mascota.all()
        return mascota;
    }

    public async getListarMascotasPorEspecie({request}:HttpContextContract): Promise<Mascota[]> {
        const especie = request.all().especie
        //console.log(especie)
        const mascotas = await Mascota.query().where({'especie':especie})
        console.log(mascotas)
        return mascotas;
    }

    public async getListarMascotasMenores8(): Promise<Mascota[]> {
        const mascotas = await Mascota.query().where('edad','<',8)
        console.log(mascotas)
        return mascotas;
    }

    public async setRegistrarMascota({request,response}:HttpContextContract){
        const dataMascota = request.only(['codigo_animal','nombre_animal','especie','raza', 'genero', 'edad'])
        try {
            const codigoMascota = dataMascota.codigo_animal
            const MascotaExistente :number = await this.getValidarMascotaExistente(codigoMascota)
            if (MascotaExistente == 0){
                await Mascota.create(dataMascota)
                response.status(200).json({'msg': 'Registro de Mascota completo.'})
            } else {
                response.status(400).json({'msg':'El codigo del Mascota ya se encuentra registrado.'})
            }
        }catch(error){
            console.log(error)
            response.status(500).json({'msg':'Error en el servidor.'})
        }
    }

    private async getValidarMascotaExistente(codigo_animal:number): Promise<number>{
        let total = await Mascota.query().where({'codigo_animal':codigo_animal}).count('*').from('Mascotas')
        //console.log(total[0].$extras['count(*)'])
        return parseInt(total[0].$extras['count(*)'])
    }

    public async actualizarMascota({ request, response}:HttpContextContract){
        const codigo = request.all().codigo;
        const datos = request.all();
        const mascota = await Mascota.findOrFail(codigo)
        mascota.nombre_animal = datos.nombre_animal
        mascota.especie = datos.especie
        mascota.edad = datos.edad
        mascota.genero = datos.genero
        mascota.raza = datos.raza
        await mascota.save()
        response.status(200).json({'msg': 'Registro actualizado.'})
    }

    public async eliminarMascota({ request , response}: HttpContextContract){
        const codigo = request.all().codigo
        await Mascota.query().where('codigo_animal',codigo).delete();
        response.status(200).json({'msg': 'Registro eliminado.'})
    }

}
