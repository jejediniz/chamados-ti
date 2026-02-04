import api from "./api";

export async function listarUsuarios() {
  const response = await api.get("/users");
  return response.data;
}

export async function criarUsuario(dados) {
  const response = await api.post("/users", {
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    tipo: dados.tipo,
    admin: dados.admin,
    ativo: dados.ativo,
  });

  return response.data;
}
