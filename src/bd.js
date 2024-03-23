import  {createPool}  from "mysql2/promise";

// crea la conexión a la base de datos 
export const pool  =  createPool ( { 
    host : "localhost", 
    user : "root", 
    port : 3306,
    database:"yulieth",
    // password: ""
} ) ;
