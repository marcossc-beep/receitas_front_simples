const API_URL = "http://localhost:3000/usuarios";
const containerUsuarios = document.getElementById("lista-usuarios");

let idEdicao = null; // Definida no topo para ser global

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

    if (idEdicao) {
        // Se idEdicao tiver valor, ele faz o PUT
        await fetch(`${API_URL}/${idEdicao}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });
        idEdicao = null; // Limpa após editar
    } else {
        // Se não, faz o POST normal
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });
    }

    // Limpa os campos
    document.getElementById("nome").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("email").value = "";
    renderizaUsuarios();
}

// Essa função agora apenas joga os dados nos inputs lá no topo
function preencherCamposParaEdicao(id, nome, email) {
    document.getElementById("nome").value = nome;
    document.getElementById("email").value = email;
    idEdicao = id; // Aqui a variável global ganha o valor do ID
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
            <p>Email: ${usuario.email}</p>
            <p><small>Criado em: ${new Date(usuario.criado_em).toLocaleString()}</small></p>
            <button onclick="preencherCamposParaEdicao(${usuario.id}, '${usuario.nome}', '${usuario.email}')">Editar</button>
            <button onclick="deletarUsuario(${usuario.id})" style="color: red;">Deletar</button>
        `;
        containerUsuarios.appendChild(card);
    });
}

renderizaUsuarios();