const { addPlayer } = require("../db/PlayerQueries")
const axios = require('axios')

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const getAge = () => {  
    return Math.floor(
      Math.random() * (41 - 18) + 18
    )
  }

const getRandomValueIncrease = () => {  
    let increase = Math.random() * (100 - 10) + 10;
    return Math.round((increase  + Number.EPSILON) * 100) / 100;

}

const createPlayer = async ( team_id , role) => {

    console.log("init player - " + role);

    try {
        const response = await axios.get('https://randomuser.me/api/');
        const randomPerson = response.data.results[0];
        // console.log(randomPerson);
        let player = {
            team_id: team_id,
            firstname: randomPerson.name.first,
            lastname: randomPerson.name.last,
            age: await getAge(),
            role:role,
            marketvalue:1000000
        };
        const savedPlayer = await addPlayer(player);
        return savedPlayer;
    } catch (error) {
        throw error
    }

}

const getPlayerNewMarketValue = async (player) => {
    const oldMarketValue = parseFloat(player.marketvalue);

    return ((100 + await getRandomValueIncrease()) / 100 ) * oldMarketValue

}

module.exports = {
    createPlayer,
    getPlayerNewMarketValue
}