const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://root:rootpwd@localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'ufcwebauth';

var user_collection;
var prod_collection;
const db = client.db(dbName);
async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  //const db = client.db(dbName);
  user_collection = db.collection('user');
  prod_collection = db.collection('produtos');
  // the following code examples can be pasted here...
   
  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error);
//   .finally(() => client.close());

async function getUsers(username, password) {
    const findResult = await user_collection.find({username: username, password: password}).toArray();
    console.log('Found documents =>', findResult);
    return findResult;
}
async function getProdutos() {
  const Produtos = await prod_collection.find().toArray();
  console.log('Found documents =>', Produtos);
  //const {username , categoria, nome, descricao, valor} = Produtos;
  return Produtos;
}
async function getProdutosFilter(username) {
  const Produtos = await prod_collection.find({username: username}).toArray();
  console.log(`Username ${username} (Filter) =>`, Produtos);
  return Produtos;
}

async function setProdutos(prod) {
  const produto = await prod_collection.insertOne(prod);
  console.log("produto cadastrado->",produto);
  return produto;
 
}
exports.getUsers = getUsers;
exports.getProdutos = getProdutos;
exports.getProdutosFilter = getProdutosFilter;
exports.setProdutos = setProdutos;