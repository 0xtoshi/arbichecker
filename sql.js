const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : '',
      database : 'arb_eligible'
    }
  });



  (async() => {

    let data = await knex.column('_recipients', '_claimableAmount')
    .select()
    .from('list')
    .orderBy('_claimableAmount', 'ASC');

    const csv = convertArrayToCSV(data);

    fs.writeFileSync('./eligible.csv', csv);

    


  })()