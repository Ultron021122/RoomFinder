-- Tabla users
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	type_user VARCHAR(20) CHECK (type_user IN ('student', 'lessor')) NOT NULL,
	name VARCHAR(45) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	birthday DATE NOT NULL,
	status VARCHAR(20) CHECK (status IN ('active', 'inactive')) NOT NULL,
	created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla estudiantes
CREATE TABLE students (
  code_student BIGINT PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  university VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla arrendadores
CREATE TABLE lessors (
  user_id INTEGER PRIMARY KEY,
  phone VARCHAR(11) NOT NULL,
  street VARCHAR(255) NOT NULL,
  zip INTEGER NOT NULL,
  suburb VARCHAR(100) NOT NULL,
  municipality VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla inmueble
CREATE TABLE estate (
  id SERIAL PRIMARY KEY,
  lessor_id INTEGER NOT NULL,
  type_house VARCHAR(20) CHECK (type_house IN ('casa', 'departamento', 'habitación')),
  title VARCHAR(60) NOT NULL,
  description TEXT NOT NULL,
  domicilie VARCHAR(255) NOT NULL,
  zip INTEGER NOT NULL,
  suburb VARCHAR(100) NOT NULL,
  municipality VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lgn DOUBLE PRECISION NOT NULL,
  availability BOOLEAN DEFAULT FALSE,
  price DECIMAL(9,2) NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lessor_id) REFERENCES lessors(user_id)
);

-- Tabla caracteristicas
CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  estate_id INTEGER NOT NULL,
  type_construction VARCHAR(50) CHECK (type_construction IN ('tradicional', 'prefabricada', 'sostenible', 'modular')),
  wc INTEGER DEFAULT 0,
  bedrooms INTEGER DEFAULT 0,
  light BOOLEAN DEFAULT FALSE,
  internet BOOLEAN DEFAULT FALSE,
  water BOOLEAN DEFAULT FALSE,
  pets BOOLEAN DEFAULT FALSE,
  garden BOOLEAN DEFAULT FALSE,
  width DECIMAL(10,2),
  length DECIMAL(10,2),
  FOREIGN KEY (estate_id) REFERENCES estate(id)
);

-- Tabla fotos
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  estate_id INTEGER NOT NULL,
  path VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY (estate_id) REFERENCES estate(id)
);

-- Tabla comentarios
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  estate_id INTEGER NOT NULL,
  commentary VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (estate_id) REFERENCES estate(id)
);

-- Tabla ratings
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  estate_id INTEGER NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (estate_id) REFERENCES estate(id)
);