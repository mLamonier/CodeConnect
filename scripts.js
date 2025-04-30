const uploadBtn = document.getElementById("upload-btn");
const inputUpload = document.getElementById("image-upload")

//atribui um evento de click no botão 'carregar imagem', como se estivesse
//clicando no campo input do type file que está com display none
uploadBtn.addEventListener("click", () => {
    inputUpload.click();
})

//uma função que retorna uma promessa
function lerConteudoDoArquivo(arquivo) {
    //uma promise é um objeto que recebe 2 parâmetros
    //resolve: quando a promessa é cumprida
    //reject: quando a promessa não pode ser cumprida
    return new Promise((resolve, reject) => {
        //API FileReader que faz com que seja possível usar métodos de leitura de arquivos
        const leitor = new FileReader();
        //se o arquivo for lido, o método resolve é executado, captando 2 propriedades do arquivo enviado
        //url: leitor.result (retorna a url da imagem em data:imagem/base64)
        //nome: arquivo.name (name é o nome + extensão do arquivo enviado)
        leitor.onload = () => {
            resolve({ url: leitor.result, nome: arquivo.name });
        }
        //se o arquivo não puder ser lido, aparece uma mensagem de erro na catch abaixo
        leitor.onerror = () => {
            reject(`Erro na leitura do arquivo ${arquivo.name}`)
        }
        //cria uma url Data para o arquivo, é utilizada no resolve quando o arquivo for lido
        leitor.readAsDataURL(arquivo);
    });
}

const imagemPrincipal = document.querySelector('.main-imagem');
const nomeDaImagem = document.querySelector('.container-imagem-nome p');

//quando haver um evento de 'mudança' na tag input type file, isso acontece:
//o evento de mudança cria uma function async (assíncrona)
inputUpload.addEventListener('change', async (evento) => {
    //este código pega o evento de mudança de arquivos
    const arquivo = evento.target.files[0];

    //então SE exister arquivo nessa mudança, acontece isso:
    if (arquivo){
        //try = tente isso
        try {
            //aqui o comando await é usado antes da function porque ele tem a função de fazer 'esperar'
            //um retorno da function, ou seja, ele a torna sincrona aqui para que o código possa funcionar depois disso
            const conteudoDoArquivo = await lerConteudoDoArquivo(arquivo);
            //tente o retorno da promise, agora é possivel pegar os dados do arquivo
            imagemPrincipal.src = conteudoDoArquivo.url;
            nomeDaImagem.textContent = conteudoDoArquivo.nome;
        //catch = se deu erro na tentativa, faça isso
        } catch (erro) {
            console.error('Erro na leitura do arquivo:', erro);
        }
    }
})