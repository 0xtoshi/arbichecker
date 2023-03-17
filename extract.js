const abiDecoder = require('abi-decoder'); // NodeJS
const fs = require('fs');
let data = JSON.parse(fs.readFileSync('./graphql.json','utf-8'));
let ABI = JSON.parse(fs.readFileSync('./ABI.json','utf-8'));
abiDecoder.addABI(ABI);

let tx = data.data.get_execution.execution_succeeded.data;
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



tx.map(async v => {
    let decodedData = abiDecoder.decodeMethod(v.data);
    if(decodedData !== undefined){
    let eligible = [];
    for(i=0; i<decodedData.params[0].value.length; i++)
    {
        eligible.push({
            _recipients : decodedData.params[0].value[i],
            _claimableAmount : Math.round(decodedData.params[1].value[i]/1e18)

        })
    }
    await knex('list').insert(eligible);
    }
})