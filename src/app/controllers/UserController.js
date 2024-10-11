/*
     store => cadastra / adicionar
     index => listar varios
     show => listar apenas um
     update => atualizar
     delet => deletar
*/
import  User from '../controllers/models/User'
import { v4 } from 'uuid'
import * as Yup from 'yup'


class UserController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
            admin: Yup.boolean(),
        })

        try {
            schema.validateSync(request.body, { abortEarly: false })
        } catch(err) {
            return response.status(400).json({ error:  err.errors})
        }


        const { name, email, password, admin } = request.body

        const userExists = await User.findOne({
            where: {
                email,
            }
        })


        if (userExists) {
            return response.status(400).json({ error: 'Usuario ja existe!'})
        }

        console.log(userExists)

        const user =  await User.create({
            id: v4(),
            name,
            email,
            password,
            admin,
        })
    
        return response.status(201).json({
            id: user.id,
            name,
            email,
            admin
        })
    }
}

export default new UserController()