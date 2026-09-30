const url = 'http://localhost:3000/tarefas';
const tarefas = [];

function mostrar(pagina) {
  document.getElementById("home").style.display = "none";
  document.getElementById("temperatura").style.display = "none";
  document.getElementById("tarefas").style.display = "none";

  document.getElementById(pagina).style.display = "flex";
  document.getElementById(pagina).style.flexDirection = "column";

  if (pagina === "home") {
    carregar();
  }
}

async function buscar() {

  const cidade = document.getElementById("cidade").value.trim();
  const resultado = document.getElementById("result");

  if (cidade === "") {
    resultado.innerHTML = "Digite o nome de uma cidade.";
    return;
  }

  const apiKey = "bee1cecedce954bcea0d6cc752dc496e";

  resultado.innerHTML = "Buscando temperatura...";

  try {

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)},BR&appid=${apiKey}&units=metric&lang=pt_br`
    );

    const dados = await res.json();

    if (!res.ok) {
      resultado.innerHTML = "Cidade não encontrada.";
      return;
    }

    const temperatura = Math.round(dados.main.temp);
    const descricao = dados.weather[0].description;
    const cidadeNome = dados.name;

    resultado.innerHTML = `
      <div class="clima">
        <h3>${cidadeNome}</h3>

        <p class="temperatura-valor">
          ${temperatura}°C
        </p>

        <p class="descricao-clima">
          ${descricao}
        </p>

        <p>
          Sensação térmica: ${Math.round(dados.main.feels_like)}°C
        </p>

        <p>
          Umidade: ${dados.main.humidity}%
        </p>
      </div>
    `;

  } catch (erro) {

    console.error("Erro:", erro);

    resultado.innerHTML =
      "Não foi possível consultar a temperatura. Verifique se o servidor está funcionando e tente novamente.";
  }
}
carregar();

function carregar() {

  fetch(url + '/listar')
    .then(response => response.json())
    .then(data => {

      tarefas.length = 0;
      tarefas.push(...data);

      listar();

    })
    .catch(error => {
      console.error("Erro ao carregar tarefas:", error);
    });
}


function listar() {

  const container = document.getElementById('listagem');

  container.innerHTML = "";

  tarefas.forEach(tarefa => {

    const card = document.createElement('div');

    card.classList.add('card');

    card.innerHTML = `
      <img src="${tarefa.img}">
      <h2>${tarefa.nome}</h2>
      <p>${tarefa.desc}</p>
      <p>Início: ${tarefa.inicio}</p>
      <p>Fim: ${tarefa.fim}</p>

      <button onclick="excluir(${tarefa.id})">
        Excluir
      </button>
    `;

    container.appendChild(card);
  });
}

document.querySelector('form').addEventListener('submit', function(e) {

  e.preventDefault();

  const novo = {

    nome: document.getElementById("nome").value,

    desc: document.getElementById("desc").value,

    inicio: document.getElementById("inicio").value,

    fim: document.getElementById("fim").value,

    img: document.getElementById("img").value

  };

  fetch(url + '/cadastrar', {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(novo)

  })

  .then(() => {

    alert("Tarefa adicionada com sucesso.");

    carregar();

    document.querySelector('form').reset();

  })

  .catch(() => {

    alert("Erro ao cadastrar tarefa.");

  });

});

function excluir(id) {

  if (!confirm("Deseja excluir essa tarefa?")) {
    return;
  }

  fetch(`${url}/excluir/${id}`, {

    method: 'DELETE',

  })

  .then(() => {

    alert("Excluído com sucesso.");

    carregar();

  })

  .catch(() => {

    alert("Erro ao excluir tarefa.");

  });

}
