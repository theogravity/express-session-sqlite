-- Up
CREATE TABLE sessions (
    sid TEXT PRIMARY KEY,
    data TEXT,
    expires INTEGER
);

-- Down
DROP TABLE sessions;
