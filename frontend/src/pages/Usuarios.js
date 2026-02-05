import { useEffect, useState } from "react";
import { listarUsuarios, criarUsuario } from "../services/usuariosApi";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "comum",
    admin: false,
    ativo: true,
  });

  async function carregarUsuarios() {
    setCarregando(true);
    setErro(null);
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      setErro(error.message || "Erro ao carregar usuários");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nome || !form.email || !form.senha) {
      setErro("Nome, email e senha são obrigatórios");
      return;
    }

    setErro(null);
    setSucesso(null);
    try {
      await criarUsuario(form);
      setForm({
        nome: "",
        email: "",
        senha: "",
        tipo: "comum",
        admin: false,
        ativo: true,
      });
      setSucesso("Usuário criado com sucesso");
      carregarUsuarios();
    } catch (error) {
      setErro(error.message || "Erro ao criar usuário");
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Usuários</h2>
        <p className="page-subtitle">Cadastro e controle de acesso</p>
      </div>

      <div className="chamados-layout">
        <form onSubmit={handleSubmit} className="form-card">
          {erro && <div className="alert alert-error">{erro}</div>}
          {sucesso && <div className="alert alert-success">{sucesso}</div>}
          <div className="form-group">
            <label>Nome</label>
            <input
              name="nome"
              placeholder="Nome completo"
              value={form.nome}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="email@exemplo.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="Senha inicial"
              value={form.senha}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="comum">Comum</option>
              <option value="ti">TI</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="admin"
                checked={form.admin}
                onChange={handleChange}
              />{" "}
              Administrador
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="ativo"
                checked={form.ativo}
                onChange={handleChange}
              />{" "}
              Ativo
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-acao btn-editar">
              Criar usuário
            </button>
          </div>
        </form>

        <div className="table-card">
          <div className="table-header">
            <strong>Usuários cadastrados</strong>
          </div>
          <table className="chamados-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Admin</th>
                <th>Ativo</th>
              </tr>
            </thead>
            <tbody>
              {carregando && (
                <tr>
                  <td colSpan="5">Carregando...</td>
                </tr>
              )}
              {!carregando && usuarios.length === 0 && (
                <tr>
                  <td colSpan="5">Nenhum usuário encontrado.</td>
                </tr>
              )}
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>{u.tipo}</td>
                  <td>{u.admin ? "Sim" : "Não"}</td>
                  <td>{u.ativo ? "Sim" : "Não"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
