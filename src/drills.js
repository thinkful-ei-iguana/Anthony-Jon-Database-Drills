require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})


function searchByProductName(searchTerm) {
  knexInstance
    .select('name', 'price', 'date_added', 'category')
    .from('shopping_list')
    .where('name', 'iLIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}
searchByProductName('Fish tricks');

function paginateProducts(page) {
  const productsPerPage = 6
  const offset = productsPerPage * (page - 1)
  knexInstance
    .select('name', 'price', 'date_added', 'category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

paginateProducts(2)

function itemsAddedAfterDate(daysAgo) {
  knexInstance('shopping_list')
    .select('name', 'date_added', 'price', 'category')
    .count('date_added AS date')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? daysAgo'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    //.groupBy('name', 'date_added')
    // .orderBy([
    //   { column: 'name', order: 'ASC' },
    //   { column: 'date_added', order: 'DESC' },
    // ])
    .then(result => {
      console.log(result);
    });
}

itemsAddedAfterDate(30);
