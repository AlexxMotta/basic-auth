//Framework
const express = require("express");
const app = express()
//json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//Database
const basicAuth = require('express-basic-auth');
const database = require("./database/mongoDB");
//View engine
app.set('view engine', 'ejs');
app.set('views', 'src/views/');


//Port do server
const port = 3333;
const {uuid} = require('uuidv4');
const { Db } = require("mongodb");


var categorias = 
[
    {'chave':'1','valor':'Eletrodomesticos'},
    {'chave':'2','valor':'Eletronicos'},
    {'chave':'3','valor':'Livros'},
    {'chave':'4','valor':'Vestuario'}
]


//Basic Auth
app.use("/produtos/*",basicAuth({
    authorizer: myAuthorizerMongo,
    challenge: true,
    authorizeAsync: true
  }))


//Variavel que recebe o usuario logado
var userAtual;
function myAuthorizerMongo(username, password, callback) {
    console.log(database.getUsers(username, password).then(users => {
        console.log("user Basic Auth");
        console.log(username + "-"+password);
        userAtual = username;
        callback(null, users.length == 0 ? false : true);
        //return cb(null, users.length > 0);
        
    }));
}


//Tela Inical (home)
app.get('/', (req, res) => {
    console.log("GET SUCESSFUL")
    res.redirect("/home");
    //cod
});

var produtos = [];
//espera obter todos os produtos para poder exibir
async function verficationProduts(){
    try {
       produtos = await database.getProdutos();
    } catch (error) {
        console.log(error);
    }
    
}
app.get('/home', async (req, res) => {
    await verficationProduts();
    // console.log("Produtos - "+ produtos[1].categoria)
    res.render(`home`, {title: `Lab MPA`, message: `Bem vindo ao Lab MPA`, port:port,prod:produtos});
    
});

//Tela de exibição dos produtos
app.get('/produtos/produto-novo', (req, res) => {
    res.render(`produto-novo`, {port:port, produtos:produtos, categorias: categorias, user:userAtual});
    
});

//espera vereficiar para depois exibir
async function verficationProdutsFilter(){
    try {
       const produtosFilter = await database.getProdutosFilter(userAtual);
       console.log("User atual na funcao verificationProduts",userAtual)
       return produtosFilter;
    } catch (error) {
        console.log(error)
    }
    
}

app.get('/produtos/meus-produtos', async(req, res) => {
    const produtos = await verficationProdutsFilter();
    console.log("username - ",userAtual);
    console.log("Produtos no Banco - ",produtos);
    res.render(`meus-produtos`, {title: `CADASTRO DE PRODUTOS`, message: `Ensira os dados para efetuar o cadastro`,
    port:port, produtos:produtos, categorias: categorias, user:userAtual, prod:produtos});
});

//formulario cadastro produto
app.post('/form-produtos',async (req, res,next) => {
    const {categoria, nome, descricao, valor} = req.body
    console.log(" ")
    console.log(req.body);
    console.log(" ")
    console.log("categ-",categoria);
    console.log("cnome-",nome);
    console.log("descri-",descricao);
    console.log("valor-",valor);
    console.log(" ")
    database.setProdutos(req.body).then((resposta)=>{
        console.log("Resposta");
        console.log(resposta);
        res.redirect("/produtos/meus-produtos")

    })
    //id precisa ser gerado automaticamente
    
});
app.post('/teste-insercao',async (req, res,next) => {
    

    //id precisa ser gerado automaticamente
    
    res.redirect("/produtos/meus-produtos")
});


app.listen(port,()=>{
    console.log(`Codigo executando na porta ${port}`);
})