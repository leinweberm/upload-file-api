GRANT ALL PRIVILEGES ON DATABASE pgadmin TO pgadmin;

CREATE SCHEMA IF NOT EXISTS uploads;

ALTER SCHEMA uploads OWNER TO pgadmin;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS uploads.files (
    file_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    file_name TEXT DEFAULT NULL,
    file_size BIGINT NOT NULL,
    sha1 TEXT NOT NULL,
    uploaded TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (file_uuid)
);

ALTER TABLE uploads.files OWNER TO pgadmin;

INSERT INTO uploads.files (file_name, file_size, sha1)
VALUES ('example-file.txt', 123456, 'da39a3ee5e6b4b0d3255bfef95601890afd80709');