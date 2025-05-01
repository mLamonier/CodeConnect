const uploadBtn = document.getElementById("upload-btn");
const inputUpload = document.getElementById("image-upload");

// Adiciona um evento de clique no botão 'carregar imagem' para simular um clique no input de arquivo (que está oculto)
uploadBtn.addEventListener("click", () => {
    inputUpload.click();
});

// Função que retorna uma promessa para ler o conteúdo de um arquivo
function lerConteudoDoArquivo(arquivo) {
    // Uma promessa é um objeto que pode ser resolvido (cumprido) ou rejeitado (não cumprido)
    return new Promise((resolve, reject) => {
        // Cria uma instância do FileReader para ler o arquivo
        const leitor = new FileReader();
        
        // Executado quando o arquivo é lido com sucesso
        leitor.onload = () => {
            resolve({
                url: leitor.result, // URL da imagem em formato base64
                nome: arquivo.name // Nome do arquivo com extensão
            });
        }
        
        // Executado se ocorrer um erro durante a leitura do arquivo
        leitor.onerror = () => {
            reject(`Erro na leitura do arquivo ${arquivo.name}`); // Mensagem de erro
        }
        
        // Inicia a leitura do arquivo como uma URL Data
        leitor.readAsDataURL(arquivo);
    });
}

const imagemPrincipal = document.querySelector('.main-imagem');
const nomeDaImagem = document.querySelector('.container-imagem-nome p');

// Adiciona um evento de mudança no input de arquivo para lidar com a seleção de um novo arquivo
inputUpload.addEventListener('change', async (evento) => {
    const arquivo = evento.target.files[0]; // Obtém o primeiro arquivo selecionado

    //faz uma verificação se o arquivo é .png, .jpeg ou .jpg
    if(!arquivo.type.match('image/png') && !arquivo.type.match('image/jpeg') && !arquivo.type.match('image/jpg')) {
        alert('Por favor, selecione uma imagem PNG, JPEG ou JPG');
        return;
    }

    //verifica se o arquivo tem um tamanho até 5MB
    //1 megabyte = 1024 kilobytes   |   1 kylobyte = 1024 bytes
    //primeiro se acha 5KB pra depois transformar em 5MB
    if(arquivo.size > 5 * 1024 * 1024) { //aqui tem que transformar bytes em megabytes
        alert('A imagem deve ter no máximo 5MB.')
        return;
    }

    // Se um arquivo foi selecionado, tenta ler seu conteúdo
    if (arquivo) {
        try {
            // Aguarda a leitura do arquivo, tornando a função assíncrona
            const conteudoDoArquivo = await lerConteudoDoArquivo(arquivo);
            // Atualiza a imagem e o nome com os dados do arquivo lido
            imagemPrincipal.src = conteudoDoArquivo.url;
            nomeDaImagem.textContent = conteudoDoArquivo.nome;
        } catch (error) {
            // Captura e exibe qualquer erro que ocorra durante a leitura do arquivo
            console.error('Erro na leitura do arquivo:', error);
        }
    }
});

const inputTags = document.getElementById('categoria');
const listaTags = document.querySelector('.lista-tags');

listaTags.addEventListener('click', (evento) => {
    if (evento.target.classList.contains('remove-tag')) {
        const tagQueQueremosRemover = evento.target.parentElement;
        listaTags.removeChild(tagQueQueremosRemover);
    }
})

const tagsDisponiveis = ['Front-end', 'Programação', 'Data science', 'Full-stack', 'HTML', 'CSS', 'Javascript'];

async function verificaTagsDisponiveis(tagTexto){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(tagsDisponiveis.includes(tagTexto));
        }, 1000) //1000 = 1 segundo de atraso (simulando uma solicitação para o banco de dados)
    })
}

inputTags.addEventListener('keypress', async (evento) => {
    if (evento.key == 'Enter') {
        evento.preventDefault();
        const tagTexto = inputTags.value[0].toUpperCase() + inputTags.value.substring(1);
        if (tagTexto !== '') {
            try {    
                const tagExiste = await verificaTagsDisponiveis(tagTexto);
                if (tagExiste) {
                    const tagNova = document.createElement('li');
                    tagNova.innerHTML = `
                        <p>${tagTexto}</p>
                        <img src="./img/close-black.svg" class="remove-tag">
                    `
                    listaTags.appendChild(tagNova)
                    inputTags.value = '';
                } else {
                    alert('Tag não foi encontrada.');
                }
            } catch (error) {
                console.error('Erro ao verificar a existência da tag:', error);
                alert('Erro ao verificar a existência da tag. Verifique o console para mais detalhes.');
            }
        }
    }
})

const botaoPublicar = document.querySelector('.botao-publicar');

async function publicarProjeto(nomeDoProjeto, descricaoDoProjeto, tagsProjeto) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const deuCerto = Math.random() > 0.5;

            if (deuCerto) {
                resolve('Projeto publicado com sucesso!')
            } else {
                reject('Erro ao publicar o projeto.');
            }
        }, 2000);
    })
}

botaoPublicar.addEventListener('click', async (evento) => {
    evento.preventDefault();

    const nomeDoProjeto = document.getElementById('nome').value;
    const descricaoDoProjeto = document.getElementById('descricao').value;
    //cria um array a partir de uma nodelist (Array.from) de todas as tags P dentro da listaTags (ul)
    //para pegar somente o textContent é necessário usar a função map informando o que queremos pegar entre parenteses
    //só é possível usar a função map em um array, não é possível usar em uma NodeList
    const tagsProjeto = Array.from(listaTags.querySelectorAll('p')).map((tag) => tag.textContent);

    if (nomeDoProjeto == ''){
        alert('O campo "Nome do Projeto" não pode ser vazio');
        return;
    }

    if (descricaoDoProjeto == ''){
        alert('O campo "Descrição" não pode ser vazio');
        return;
    }

    if (tagsProjeto.length == 0 && inputTags.value !== ''){
        alert('Aperte a tecla "Enter" no campo "Tags" para inserir a tag desejada');
        return;
    }

    if (tagsProjeto.length == 0){
        alert('O campo "Tags" deve conter no mínimo 1 tag');
        return;
    }

    try {
        const resultado = await publicarProjeto(nomeDoProjeto, descricaoDoProjeto, tagsProjeto);
        console.log(resultado);
        alert('Deu tudo certo!');
    } catch (error) {
        console.log('Deu errado: ', error);
        alert('Deu tudo errado!');
    }
})

const botaoDescartar = document.querySelector('.botao-descartar');

botaoDescartar.addEventListener('click', (evento) => {
    evento.preventDefault();

    const formulario = document.querySelector('form');
    //reseta todos os campos input dentro do form selecionado
    formulario.reset();

    imagemPrincipal.src = './img/imagem1.png';
    nomeDaImagem.textContent = 'image_projeto.png';
    
    listaTags.innerHTML = '';
})