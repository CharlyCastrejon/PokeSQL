const { getConnection } = require('./db');

// Operaciones CRUD

class PokemonDAO {
    async insert(pokemonData){
        let connection;
        try {
            connection = await getConnection();
            const [result] = await connection.execute(
                'INSERT INTO pokemon (nombre, tipo, peso, altura) VALUES (?, ?, ?, ?)',
                [pokemonData.nombre, pokemonData.tipo, pokemonData.peso, pokemonData.altura]
            );
            return {insertId: result.insertId, ...pokemonData };
        } catch (error){
            throw error;
        } finally {
            if (connection){
                connection.release();
            }
        }
    }

    async findAll() {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM pokemon');
            return rows;
        } catch (error){
            throw error;
        } finally {
            if (connection){
                connection.release();
            }
        }
    }

    async findByName(nombre){
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM pokemon WHERE nombre = ?', [nombre]);
            return rows[0] || null;
        } catch (error){
            throw error;
        } finally {
            if (connection){
                connection.release();
            }
        }
    }

    async update(id, datoActualizado){
        let connection;
        try {
            connection = await getConnection();
            const [result] = await connection.execute(
                'UPDATE pokemon SET tipo = ? WHERE id = ?',
                [datoActualizado.tipo, id]
            );
            return result.affectedRows > 0;
        } catch (error){
            if (connection){
                connection.release();
            }
        }
    }

    async delete(id){
        let connection;
        try {
            connection = await getConnection();
            const [result] = await connection.execute('DELETE FROM pokemon WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error){
            throw error;
        } finally {
            if (connection){
                connection.release();
            }
        }
    } 

}

module.exports = { PokemonDAO };