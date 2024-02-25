import { Joi } from "celebrate";

export const ERROR_CODE_BAD_REQUEST = 400
export const ERROR_CODE_NOT_FOUND = 404
export const ERROR_CODE_DEFAULT = 500
export const ERROR_CODE_UNAUTHORIZED = 401

export const urlValidator = (value: string, helpers: Joi.CustomHelpers<any>) => {
    if (!/^https?:\/\/(?:www\.)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*#?$/.test(value)) {
        return helpers.error('Invalid avatar URL format');
    }
    return value;
};