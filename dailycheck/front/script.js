const url = 'http://localhost:3000/tarefas';
const tarefas = [];

function mostrar(pagina) {
  document.getElementById("home").style.display = "none";
  document.getElementById("temperatura").style.display = "none";
  document.getElementById("tarefas").style.display = "none";

  document.getElementById(pagina).style.display = "flex";
  document.getElementById(pagina).style.flexDirection = "column";

  if (pagina === "home") {
    carregarTarefas();
  }
}

//-------------------------//
async function buscar() {
  const cidade = document.getElementById("cidade").value;
  const apiKey = "bee1cecedce954bcea0d6cc752dc496e";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`
    );

    const dados = await res.json();

    document.getElementById("resultado").innerHTML = `
      ${dados.name} — ${dados.main.temp}°C <br>
      ${dados.weather[0].description}
    `;
  } catch {
    document.getElementById("result").innerText =
      "Erro ao buscar clima";
    }
}

//-------------------------//
carregar();

function carregar(){
    fetch(url + '/listar')
    .then(response => response.json())
    .then(data =>{
        tarefas.length = 0;
        tarefas.push(...data);
        listar();
    })
}

function listar(){
  const container = document.getElementById('listagem');
  container.innerHTML = "";

  tarefas.forEach(tarefa =>{
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
          <img src="${tarefa.img}">
          <h2>${tarefa.nome}</h3>
          <p>${tarefa.desc}</p>
          <p>Início: ${tarefa.inicio}</p>
          <p>Fim: ${tarefa.fim}</p>
          <button onclick="excluir(${tarefa.id})">Excluir</button>
      `;
      container.appendChild(card);
  });
}

document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    const novo = {
        nome: nome.value,
        desc: desc.value,
        inicio: inicio.value,
        fim: fim.value,
        img: img.value
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
    })
    .catch(() => {
        alert("Erro ao cadastrar tarefa.");
    })
})

function excluir(id){
    if(!confirm("Deseja excluir essa tarefa?"))return;
    fetch(`${url}/excluir/${id}`,{
        method: 'DELETE',
    })
    .then(()=>{
        alert("Excluído com sucesso.");
        carregar();
    })
    .catch(()=>alert("Erro ao excluir tarefa."));
}