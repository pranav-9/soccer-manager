const { addPlayer, deletePlayerByID} = require("../db/PlayerQueries")
const { getOrdersByPlayerIDandStatus, deleteOrderByID } = require("../db/OrderQueries")
const axios = require('axios')
const { getTeamByID, updateTeam } = require("../db/TeamQueries")

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
            country: randomPerson.location.country,
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

const deletePlayerOrders = async (player_id) => {

    //delete pending orders of this player
    const orders = await getOrdersByPlayerIDandStatus(player_id,'CREATED');
    console.log(orders);

    if (orders == null) return;

    for (let index = 0; index < orders.length; index++) {
        const order = orders[index];
        await deleteOrderByID(order.id)            
    }

}

const deletePlayer = async (id) => {

    if (id == null) throw "Please specify player to delete";
    
    await deletePlayerOrders(id);
    const player = await deletePlayerByID(id);

    // update team value
    console.log(player);
    let team = await getTeamByID(player.team_id);
    team['value'] = parseFloat(team.value) - parseFloat(player.marketvalue);
    await updateTeam(team);

    return player;     

}

module.exports = {
    createPlayer,
    getPlayerNewMarketValue,
    deletePlayer
}