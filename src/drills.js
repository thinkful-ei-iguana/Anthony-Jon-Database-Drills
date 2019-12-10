require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});


function searchByProductName(searchTerm) {
  knexInstance
    .select('name', 'price', 'date_added', 'category')
    .from('shopping_list')
    .where('name', 'iLIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}
searchByProductName('Fish tricks');

function paginateProducts(page) {
  const productsPerPage = 6;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('name', 'price', 'date_added', 'category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

paginateProducts(2);

function itemsAddedBeforeDate(daysAgo) {
  knexInstance
    .select('id', 'name', 'date_added', 'price', 'checked', 'category')
    //.count('date_added AS dates')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .then(result => {
      console.log(result);
    });
}

itemsAddedBeforeDate(3);

function totalCost() {
  knexInstance
    .select('category')
    .from('shopping_list')
    .groupBy('category')
    .sum('price')

    .then(result => {
      console.log(result);
    });
}

totalCost();


