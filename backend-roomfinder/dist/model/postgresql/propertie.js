import { Database } from "./database.js";
import { LessorsModel } from './lessor.js';
export class PropertiesModel extends Database {
  constructor({
    id,
    lessor_id,
    type_house,
    title,
    description,
    domicilie,
    zip,
    suburb,
    municipality,
    state,
    lat,
    lgn,
    availability,
    price,
    created_date
  }) {
    super();
    this.id = id;
    this.lessor_id = lessor_id;
    this.type_house = type_house;
    this.title = title;
    this.description = description;
    this.domicilie = domicilie;
    this.zip = zip;
    this.suburb = suburb;
    this.municipality = municipality;
    this.state = state;
    this.lat = lat;
    this.lgn = lgn;
    this.availability = availability;
    this.price = price;
    this.created_date = created_date;
  }
  static async getAll() {
    const properties = await this.query("SELECT * FROM estate;");
    return properties.map(property => new PropertiesModel(property));
  }
  static async getByLessor({
    lessor_id
  }) {
    const properties = await this.query('SELECT * FROM estate WHERE lessor_id = $1;', [lessor_id]);
    return properties.map(property => new PropertiesModel(property));
  }
  static async getById({
    id
  }) {
    const property = await this.query("SELECT * FROM estate WHERE id = $1;", [id]);
    return property[0] ? new PropertiesModel(property[0]) : null;
  }
  static async create({
    input
  }) {
    try {
      const {
        lessor_id,
        type_house,
        title,
        description,
        domicilie,
        zip,
        suburb,
        municipality,
        state,
        lat,
        lgn,
        availability,
        price
      } = input;
      const validateLessor = await LessorsModel.getById({
        id: lessor_id
      });
      if (validateLessor === null) return false;
      const result = await this.query('INSERT INTO estate (lessor_id, type_house, title, description, domicilie, zip, suburb, municipality, state, lat, lgn, availability, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 ) RETURNING id;', [lessor_id, type_house, title, description, domicilie, zip, suburb, municipality, state, lat, lgn, availability, price]);
      const id = result[0].id;
      const newProperty = await this.getById({
        id
      });
      return newProperty;
    } catch (error) {
      throw new Error(`Error creating property: ${error.message}`);
    }
  }
  static async delete({
    id
  }) {
    try {
      const validate = await this.getById({
        id
      });
      if (!validate) return false;

      // Eliminar propiedad
      await this.query('DELETE FROM estate WHERE id = $1;', [id]);
      return true;
    } catch (error) {
      throw new Error(`Error deleting property: ${error.message}`);
    }
  }
  static async update({
    id,
    input
  }) {
    try {
      const {
        type_house,
        title,
        description,
        domicilie,
        zip,
        suburb,
        municipality,
        state,
        lat,
        lgn,
        availability,
        price
      } = input;
      const property = await this.getById({
        id
      });
      if (property === null) return false;
      const updateColumns = Object.entries({
        type_house,
        title,
        description,
        domicilie,
        zip,
        suburb,
        municipality,
        state,
        lat,
        lgn,
        availability,
        price
      }).filter(([key, value]) => value !== undefined).map(([key, value]) => {
        return `${key} ? $${Object.keys(input).indexOf(key) + 1}`;
      }).join(', ');
      const updateValues = Object.value({
        type_house,
        title,
        description,
        domicilie,
        zip,
        suburb,
        municipality,
        state,
        lat,
        lgn,
        availability,
        price
      }).filter(value => value !== undefined);
      if (updateValues.length !== 0) {
        await this.query(`UPDATE estate SET ${updateColumns} WHERE id = $${updateValues.length + 1};`, [...updateValues, id]);
      }
      return await this.getById({
        id
      });
    } catch (error) {
      throw new Error(`Error updating property: ${error.message}`);
    }
  }
}