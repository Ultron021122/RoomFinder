"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.options = void 0;
const options = exports.options = {
  basePath: '/',
  definition: {
    openapi: '3.0.0',
    info: {
      title: "RoomFinder",
      description: 'Autor: Sebastián Martínez López, Documentación de la API.',
      version: '1.9'
    }
  },
  apis: ['./src/routes/**/*.js']
};