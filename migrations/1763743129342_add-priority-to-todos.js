exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql('ALTER TABLE todos ADD COLUMN priority INTEGER DEFAULT 1;');
};

exports.down = pgm => {
    pgm.sql('ALTER TABLE todos DROP COLUMN priority;');
};
