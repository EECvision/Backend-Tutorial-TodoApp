exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user' NOT NULL;");
};

exports.down = pgm => {
    pgm.sql('ALTER TABLE users DROP COLUMN role;');
};
