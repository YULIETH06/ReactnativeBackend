import { pool } from '../bd.js';
import jwt from 'jsonwebtoken';
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por email electrónico
    const [rows] = await pool.query('SELECT * FROM registro WHERE email = ?', [email]);

    // Verificar si se encontró un usuario con ese email electrónico
    if (rows.length === 0) {
      return res.status(404).json({ message: "Correo electrónico no está registrado" });
    }

    // Verificar si la cuenta está bloqueada
    if (rows[0].lockUntil > Date.now()) {
      // La cuenta está bloqueada
      return res.status(403).json({ message: `La cuenta está bloqueada por 1 minuto. Inténtalo de nuevo más tarde.` });
    }

    if (rows[0].password === password) {
      // Restablecer el contador de intentos fallidos si el inicio de sesión es exitoso
      await pool.query('UPDATE registro SET loginAttempts = 0 WHERE email = ?', [email]);

      // Generar un token
      const token = jwt.sign(
        { userId: rows[0].id, userEmail: rows[0].email },
        'tu_secreto_secreto', // Reemplaza esto con una cadena secreta más segura
        { expiresIn: '1h' } // Opcional: especifica la duración del token
      );

      return res.status(200).json({ message: "Inicio de sesión exitoso", token });
    } else {
      // Incrementar el contador de intentos fallidos
      let loginAttempts = rows[0].loginAttempts + 1;

      // Bloquear la cuenta si es necesario
      let lockUntil = null;
      if (loginAttempts >= 3) {
        lockUntil = new Date(Date.now() + 1 * 60 * 1000); // Bloquear durante 1 minuto
        loginAttempts = 0; // Restablecer el contador de intentos después del bloqueo
      }

      // Actualizar la base de datos con los intentos fallidos y el tiempo de bloqueo
      await pool.query('UPDATE registro SET loginAttempts = ?, lockUntil = ? WHERE email = ?', [loginAttempts, lockUntil, email]);

      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Algo va mal' });
  }
};

// export const Login = async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       // Buscar el usuario por email electrónico
//       const [rows] = await pool.query('SELECT * FROM registro WHERE email = ?', [email]);
  
//       // Verificar si se encontró un usuario con ese email electrónico
//       if (rows.length === 0) {
//         return res.status(404).json({ message: "Correo electrónico no está registrado" });
//       }
  
//       // Verificar si la cuenta está bloqueada
//       if (rows[0].lockUntil > Date.now()) {
//         return res.status(401).json({ message: `La cuenta está bloqueada por 1 hora. Inténtalo de nuevo más tarde.` });
//       }
  
//       if (rows[0].password === password) {
//         // Restablecer el contador de intentos fallidos si el inicio de sesión es exitoso
//         await pool.query('UPDATE registro SET loginAttempts = 0 WHERE email = ?', [email]);
  
//         // Generar un token
//         const token = jwt.sign(
//           { userId: rows[0].id, userEmail: rows[0].email },
//           'tu_secreto_secreto', // Reemplaza esto con una cadena secreta más segura
//           { expiresIn: '1h' } // Opcional: especifica la duración del token
//         );
  
//         return res.status(200).json({ message: "Inicio de sesión exitoso", token });
//       } else {
//         // Incrementar el contador de intentos fallidos y bloquear la cuenta si es necesario
//         const loginAttempts = rows[0].loginAttempts + 1;
//         let lockUntil = 0;
  
//         if (loginAttempts >= 3) {
//         //   lockUntil = new Date(Date.now() + 60 * 60 * 1000); // Bloquear durante 1 hora
//         lockUntil = new Date(Date.now() + 1 * 60 * 1000); // Bloquear durante 5 minutos
//         }
  
//         await pool.query('UPDATE registro SET loginAttempts = ?, lockUntil = ? WHERE email = ?', [loginAttempts, lockUntil, email]);
  
//         return res.status(401).json({ message: "Contraseña incorrecta" });
//       }
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: 'Algo va mal' });
//     }
//   };

