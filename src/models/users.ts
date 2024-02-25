import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator'
import bcrypt from 'bcryptjs'
import UnauthorizedError from '../utils/errors/unauthorizedError';

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
        minlength: [2, 'Минимальная длина поля "name" - 2'],
        maxlength: [30, 'Максимальная длина поля "name" - 30'],
        default: 'Жак-Ив Кусто',
    },
    about: {
        type: String,
        minlength: [2, 'Минимальная длина поля "about" - 2'],
        maxlength: [200, 'Максимальная длина поля "about" - 200'],
        default: 'Исследователь',
    },
    avatar: {
        type: String,
        default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
        validate: {
          validator: (v: string) => validator.isURL(v),
          message: 'Некорректный URL',
        }
    },
    email: {
        type: String,
        required: [true, 'Поле "email" должно быть заполнено'],
        unique: true,
        lowercase: true,
        validate: {
            validator: (v: string) => validator.isEmail(v),
            message: props => `${props.value} не является действительным адресом электронной почты!`
        },
    },
    password: {
        type: String,
        required: [true, 'Поле "password" должно быть заполнено'],
        select: false,
    }
}, { versionKey: false })

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email }).select('+password')
        .then((user) => {
            if(!user) throw new UnauthorizedError('Неправильные почта или пароль');

            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if(!matched) throw new UnauthorizedError('Неправильные почта или пароль');
                    return user
                })
        })
})

export default mongoose.model<TUser, UserModel>('user', userSchema)