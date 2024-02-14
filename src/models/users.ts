import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator'
import bcrypt from 'bcryptjs'

type TUser = {
    name: string;
    about: string;
    avatar: string;
    email: string;
    password: string;
}

interface UserModel extends Model<TUser> {
    findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, TUser>>
  }

const userSchema = new mongoose.Schema<TUser, UserModel>({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
        default: 'Жак-Ив Кусто',
    },
    about: {
        type: String,
        minlength: 2,
        maxlength: 200,
        default: 'Исследователь',
    },
    avatar: {
        type: String,
        default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (v: string) => validator.isEmail(v),
            message: props => `${props.value} не является действительным адресом электронной почты!`
        },
    },
    password: {
        type: String,
        required: true,
    }
})

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
        .then((user) => {
            if(!user) return Promise.reject(new Error('Неправильные почта или пароль'))

            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if(!matched) return Promise.reject(new Error('Неправильные почта или пароль'))
                    return user
                })
        })
})

export default mongoose.model<TUser, UserModel>('user', userSchema)