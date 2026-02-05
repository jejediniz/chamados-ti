ALTER TABLE chamados
ADD COLUMN IF NOT EXISTS tecnico_id INTEGER REFERENCES usuarios(id);

CREATE INDEX IF NOT EXISTS idx_chamados_tecnico_id ON chamados(tecnico_id);
