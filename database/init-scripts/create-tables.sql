CREATE TABLE IF NOT EXISTS movies
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    year SMALLINT,
    length int,
    posterUrl VARCHAR(200),
    description VARCHAR(4000),
    imdbId VARCHAR(10),
    createdAt timestamp NOT NULL DEFAULT NOW(),
    lastChanged timestamp NOT NULL DEFAULT NOW(),
    UNIQUE  (imdbId),
    UNIQUE (name, year)
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(40),
  password VARCHAR(500),
  created timestamp NOT NULL DEFAULT NOW(),
  UNIQUE(email)
);

CREATE TABLE movie_genre (
  id serial PRIMARY KEY,
  movie_id int NOT NULL,
  genre VARCHAR(20) NOT NULL,
  CONSTRAINT fk_movie_id FOREIGN KEY (movie_id) REFERENCES movies (id)
);

CREATE TABLE user_movie (
  movie_id int NOT NULL,
  user_id int NOT NULL,
  seconds_watched int DEFAULT 0,
  added bool DEFAULT false,
  CONSTRAINT fk_movie_id FOREIGN KEY (movie_id) REFERENCES movies (id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
  PRIMARY KEY (user_id, movie_id)
);


CREATE UNIQUE INDEX name_year_null_unique_idx ON movies (name) WHERE year IS NULL;
