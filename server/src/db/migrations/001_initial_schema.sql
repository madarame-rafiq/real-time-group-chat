CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() 
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(30) NOT NULL,

    created_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--Junction Table
CREATE TABLE room_members (
    room_id UUID NOT NULL  
        REFERENCES rooms(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL   
        REFERENCES users(id)
        ON DELETE CASCADE,

    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (room_id, user_id)  --Composite Primary key
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    room_id UUID NOT NULL    
        REFERENCES rooms(id)
        ON DELETE CASCADE,

    sender_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    content TEXT NOT NULL,

    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id
ON sessions (user_id);

CREATE INDEX idx_room_members_user_id
ON room_members (user_id);

CREATE INDEX idx_messages_rooms_created_at
ON messages (room_id, sent_at DESC, id DESC);

