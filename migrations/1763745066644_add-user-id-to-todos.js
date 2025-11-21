exports.shorthands = undefined;

exports.up = pgm => {
    // Delete existing data to start fresh
    pgm.sql('DELETE FROM todos;');

    pgm.sql(`
        ALTER TABLE todos 
        ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL;
    `);
};

exports.down = pgm => {
    pgm.sql('ALTER TABLE todos DROP COLUMN user_id;');
};
