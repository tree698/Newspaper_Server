import dotenv from 'dotenv';

dotenv.config();

function required(key, defaultvalue = undefined) {
  const value = process.env[key] || defaultvalue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  db: {
    host: required('HOST'),
    user: required('USERNAME'),
    password: required('PASSWORD', ''),
    database: required('DATABASE'),
  },
  host: {
    port: required('HOST_PORT', 8080),
  },
};
