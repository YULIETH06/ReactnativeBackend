import { pool } from "../bd.js";
export const createUsers = async (req, res) => {
    try {
        const { email,password} = req.body;
        const existe = 'SELECT email FROM registro where email = ? '
        const evaluar = [email];
        const [resultado] = await pool.query(existe, evaluar);
        if (resultado.length > 0) {
            return res.json({ error: "correo_existe" });
        }
        const [rows] = await pool.query(
            'INSERT INTO registro (email,password) VALUES (?,?)',
            [email,password]
        );

        return res.json({
            id: rows.insertId,
            email,
            password,
            mensaje: "registro_exitoso"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Algo va mal' });
}
}