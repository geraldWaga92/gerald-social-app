import mysql from 'mysql';

export const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: 'p3i57@T5g',
    database: 'social'
})