import { UsersModel } from './user.js'

export class LessorsModel extends UsersModel {
    constructor({ id, type_user, name, last_name, email, password, birthday, status, created_date, phone, street, zip, suburb, municipality, state }) {
        super({ id, type_user, name, last_name, email, password, birthday, status, created_date });
        this.phone = phone;
        this.street = street;
        this.zip = zip;
        this.suburb = suburb;
        this.municipality = municipality;
        this.state = state;
    }

    static async getAll() {
        const [lessors] = await this.query(
            "SELECT * FROM users LEFT JOIN lessors ON users.id = lessors.user_id WHERE users.type_user = 'lessor';"
        )
        return lessors.map((lessor) => new LessorsModel(lessor));
    }

    static async getById({ id }) {
        const [lessor] = await this.query("SELECT * FROM users LEFT JOIN lessors ON users.id = lessors.user_id WHERE users.type_user = 'lessor' AND users.id = ?;",
            [id]
        );
        return lessor[0] ? new LessorsModel(lessor[0]) : null;
    }

    static async create({ input }) {
        try {
            const { type_user, name, last_name, email, password, birthday, status, phone, street, zip, suburb, municipality, state } = input
            const result = await UsersModel.create({ input })
            const id = result.id
            const created_date = result.created_date

            const [lessor] = await this.query(
                'INSERT INTO lessors (user_id, phone, street, zip, suburb, municipality, state) VALUES (?, ?, ?, ?, ?, ?, ?);',
                [id, phone, street, zip, suburb, municipality, state]
            )

            return new LessorsModel({ id, type_user, name, last_name, email, password, birthday, status, created_date, phone, street, zip, suburb, municipality, state })
        } catch (error) {
            throw new Error(`Error creating lessor: ${error.message}`)
        }
    }

    static async delete({ id }) {
        try {
            const lessor = await UsersModel.delete({ id });
            return lessor;
        } catch (error) {
            throw new Error(`Error deleting lessor: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const { type_user, name, last_name, email, password, birthday, status, phone, street, zip, suburb, municipality, state } = input
            const user = await UsersModel.update({ id, input })
            if (user == false) return false;

            const updateColumns = Object.entries({
                phone,
                street,
                zip,
                suburb,
                municipality,
                state
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => `${key} = ?`)
                .join(', ');

            const updateValues = Object.values({
                phone,
                street,
                zip,
                suburb,
                municipality,
                state
            })
                .filter(value => value != undefined);

            await this.query(
                `UPDATE lessors SET ${updateColumns} WHERE user_id = ?;`,
                [...updateValues, id]
            );

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error updating lessor: ${error.message}`);
        }
    }
}