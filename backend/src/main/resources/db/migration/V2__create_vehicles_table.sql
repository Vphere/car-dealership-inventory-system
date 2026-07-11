CREATE TABLE vehicles (
    id         BIGSERIAL PRIMARY KEY,
    make       VARCHAR(100)   NOT NULL,
    model      VARCHAR(100)   NOT NULL,
    category   VARCHAR(50)    NOT NULL,
    price      NUMERIC(12, 2) NOT NULL,
    quantity   INTEGER        NOT NULL DEFAULT 0,
    created_at TIMESTAMP      NOT NULL DEFAULT now(),
    updated_at TIMESTAMP      NOT NULL DEFAULT now()
);
