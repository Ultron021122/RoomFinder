import { UsersModel } from './user.js'

export class StudentsModel extends UsersModel {
    constructor({ id, type_user, name, last_name, email, password, birthday, status, created_date, code_student, university }) {
        super({ id, type_user, name, last_name, email, password, birthday, status, created_date });
        this.code_student = code_student;
        this.university = university;
    }

    static async getAll() {
        const [students] = await this.query(
            "SELECT * FROM users LEFT JOIN students ON users.id = students.user_id WHERE users.type_user = 'student';"
        )
        return students.map((student) => new StudentsModel(student));
    }

    static async getById({ id }) {
        const [student] = await this.query(
            "SELECT * FROM users LEFT JOIN students ON users.id = students.user_id WHERE users.type_user = 'student' AND users.id = ?;",
            [id]
        );
        return student[0] ? new StudentsModel(student[0]) : null;
    }

    static async create({ input }) {
        try {
            const { type_user, name, last_name, email, password, birthday, status, code_student, university } = input
            const result = await UsersModel.create({ input })
            const id = result.id
            const created_date = result.created_date

            const [student] = await this.query(
                'INSERT INTO students (code_student, user_id, university) VALUES(?, ?, ?);',
                [code_student, id, university]
            )

            return new StudentsModel({ id, type_user, name, last_name, email, password, birthday, status, created_date, code_student, university })
        } catch (error) {
            throw new Error(`Error creating student: ${error.message}`);
        }
    }

    static async delete({ id }) {
        try {
            const student = await UsersModel.delete({ id });
            return student;
        } catch (error) {
            throw new Error(`Error deleting student: ${error.message}`);
        }
    }

    static async update({ id, input }) {
        try {
            const { type_user, name, last_name, email, password, birthday, status, code_student, university } = input
            const user = await UsersModel.update({ id, input })
            if (user == false) return false;

            const updateColumns = Object.entries({
                code_student,
                university
            })
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => `${key} = ?`)
                .join(', ');

            const updateValues = Object.values({
                code_student,
                university
            })
                .filter(value => value != undefined);

            await this.query(
                `UPDATE students SET ${updateColumns} WHERE user_id = ?;`,
                [...updateValues, id]
            );

            return await this.getById({ id });
        } catch (error) {
            throw new Error(`Error deleting student: ${error.message}`)
        }
    }
}