import mysql from 'mysql';

export const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: 'myfriend2022',
    database: 'social'
})