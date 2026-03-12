const API_URL = "http://localhost:3000/usuarios";
const containerUsuarios = document.getElementById("lista-usuarios");

// 1. LISTAR (GET)
async function listarUsuarios() {
    const resposta = await fetch(API_URL);
    return resposta.json();
}

// 2. CRIAR (POST)
async function criarUsuario() {
    const nome = document.getElementById("nome").value;
    const senha = document.getElementById("senha").value;

    if (!nome || !senha) {
        alert("Preencha nome e senha!");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, senha })
    });

    // Limpa os campos e atualiza a lista
    document.getElementById("nome").value = "";
    document.getElementById("senha").value = "";
    renderizaUsuarios();
}

// 3. DELETAR (DELETE)
async function deletarUsuario(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    renderizaUsuarios();
}

// 4. RENDERIZAR NA TELA
async function renderizaUsuarios() {
    const usuarios = await listarUsuarios();
    containerUsuarios.innerHTML = "";

    usuarios.forEach(usuario => {
        const card = document.createElement("div");
        card.style.border = "1px solid #ccc";
        card.style.margin = "10px";
        card.style.padding = "10px";

        card.innerHTML = `
            <h3>ID: ${usuario.id} - ${usuario.nome}</h3>
            <p>Status: ${usuario.ativo ? 'Ativo' : 'Inativo'}</p>
            <p><small>Criado em: ${new Date(usuario.criado_em).toLocaleString()}</small></p>
            <button onclick="deletarUsuario(${usuario.id})" style="color: red;">Deletar</button>
        `;
        containerUsuarios.appendChild(card);
    });
}

// Inicializa a lista ao abrir a página
renderizaUsuarios();