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

module.exports = {
    createPlayer
}