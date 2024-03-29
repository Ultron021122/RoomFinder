import { Database } from "./database.js"
import bcrypt from 'bcrypt'

export class UsersModel extends Database {

    constructor({ id, type_user, name, last_name, email, password, birthday, status, created_date }) {
        super();
        this.id = id;
        this.type_user = type_user;
        this.name = name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.birthday = birthday;
        this.status = status;
        this.created_date = created_date;
    }

    static async getAll() {
        const users = await this.query(
            "SELECT * FROM users;"
        );
        return users.map((user) => new UsersModel(user));
    }

    static async getByUser({ type_user }) {
        const users = await this.query(
            "SELECT * FROM users WHERE type_user = $1;",
            [type_user]
        );
        return users.map((user) => new UsersModel(user));
    }

    static async getById({ id }) {
        const user = await this.query(
            'SELECT * FROM users WHERE id = $1;',
            [id]
        );
        return user[0] ? new UsersModel(user[0]) : null;
    }

    static async getByEmail({ email }) {
        const user = await this.query(
            'SELECT * FROM users WHERE email = $1;',
            [email]
        );
        return user[0] ? new UsersModel(user[0]) : null;
    }

    static async login({ input }) {
        try {
            const { email, password } = input
            const user = await this.getByEmail({ email });
            if (!user) return false;

            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) return false;

            return user;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    static async create({ input }) {
        try {
            const { type_user, name, last_name, email, password, birthday, status } = input
            const validate = await this.getByEmail({ email });
            if (validate) return false;

            const result = await this.query(
                'INSERT INTO users (type_user, name, last_name, email, password, birthday, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;',
                [type_user, name, last_name, email, password, birthday, status]
            )

            const id = result[0].id;
            const newUser = await this.getById({ id })

            return newUser;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`)
        }
    }

    static async verifyEmail({ token }) {
        try {
            const validate = { token };
        } catch (error) {
            throw new Error(`Error checking email: ${error.message}`)
        }
    }

    static async updateVerified({ id }) {
        try {
            const validate = { id };
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`)
        }
    }

    static async delete({ id }) {
        try {
            const validate = await this.getById({ id });
            if (!validate) return false;

            // Eliminar usuario
            await this.query(
                'DELETE FROM users WHERE id = $1;',
                [id]
            );
            return true;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const { type_user, name, last_name, email, password, birthday, status } = input
            const validate = email ? await this.getByEmail({ email }) : null;
            if (validate) return false;
            const user = await this.getById({ id })
            if (!user) return null;

            const updateColumns = Object.entries({
                type_user,
                name,
                last_name,
                email,
                password,
                birthday,
                status,
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => {
                    return `${key} = $${Object.keys(input).indexOf(key) + 1}`; // Increment position by 1
                })
                .join(', ');

            const updateValues = Object.values({
                type_user,
                name,
                last_name,
                email,
                password,
                birthday,
                status
            })
                .filter(value => value !== undefined);

            if (updateValues.length !== 0) {
                await this.query(
                    `UPDATE users SET ${updateColumns} WHERE id = $${updateValues.length + 1};`,
                    [...updateValues, id]
                );
            }

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }
}