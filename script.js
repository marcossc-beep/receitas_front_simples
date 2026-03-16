const API_URL = "http://localhost:3000/usuarios";
const containerUsuarios = document.getElementById("lista-usuarios");

async function listarUsuarios() {
    const resposta = await fetch(API_URL);
    return resposta.json();
}


async function criarUsuario() {
    const nome = document.getElementById("nome").value;
    const senha = document.getElementById("senha").value;
    const email = document.getElementById("email").value;

    if (!nome || !senha || !email) {
        alert("Preencha nome, email e senha!");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
    });

    document.getElementById("nome").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("email").value = "";
    renderizaUsuarios();
}

async function deletarUsuario(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    renderizaUsuarios();
}

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
            <button onclick="openModal(${usuario.id}, '${usuario.nome}', '${usuario.email}')">Editar</button>
            <button onclick="deletarUsuario(${usuario.id})" style="color: red;">Deletar</button>
        `;
        containerUsuarios.appendChild(card);
    });
}

let idEdicao = null;

function openModal(id, nome, email) {
    idEdicao = id;
    const modal = document.getElementById("modal");

    // Estilos simples para centralizar o modal na tela
    modal.style.display = "block";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "#CCC";
    modal.style.color = "#000";

    modal.style.padding = "50px";
    // modal.style.border = "2px solid #333";
    modal.style.zIndex = "1000";

    modal.innerHTML = `
        <h3>Editando: ${nome}</h3>
        <input type="text" id="edit-nome" value="${nome}"><br><br>
        <input type="text" id="edit-email" value="${email}"><br><br>
        <input type="password" id="edit-senha" placeholder="Nova senha"><br><br>
        <button onclick="salvarEdicao()">Salvar</button>
        <button onclick="fecharModal()">Cancelar</button>
    `;
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
    idEdicao = null;
}

async function salvarEdicao() {
    const nome = document.getElementById("edit-nome").value;
    const email = document.getElementById("edit-email").value;
    const senha = document.getElementById("edit-senha").value;

    await fetch(`${API_URL}/${idEdicao}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
    });

    fecharModal();     
    renderizaUsuarios(); 
}

renderizaUsuarios();