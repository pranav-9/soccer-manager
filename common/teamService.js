const { getPlayersByTeamID } = require("../db/PlayerQueries");
const { addTeam, deleteTeamByID } = require("../db/TeamQueries");
const { createPlayer, deletePlayer } = require('./playerService')

const initializeTeam = async (user) => {

    if (user == null) {
        return;
    }

    console.log("init team");
    console.log(user);

    let team = {
        user_id: user.id,
        name: user.name + "'s Team",
        country: "USA",
        value: 20000000,
        budget_left: 5000000
    };

    try {
        const savedTeam = await addTeam(team);
        console.log(savedTeam);

        for (let index = 0; index < 3; index++) {
            await createPlayer(savedTeam.id,'GK');
        }
        for (let index = 0; index < 6; index++) {
            await createPlayer(savedTeam.id,'DEF');
        }
        for (let index = 0; index < 6; index++) {
            await createPlayer(savedTeam.id,'MID');
        }
        for (let index = 0; index < 5; index++) {
            await createPlayer(savedTeam.id,'ATT');
        }

    } catch (error) {
        throw error;    
    }



    return;



}

const deleteTeam = async (team_id) => {

    let players = await getPlayersByTeamID(team_id);

    console.log(players);
    if (players != null) {
        for (let index = 0; index < players.length; index++) {
            const player = players[index];
            await deletePlayer(player.id);
        }
    }

    

    const deletedTeam = await deleteTeamByID(team_id);

    return deletedTeam;     
}

module.exports = {
    initializeTeam,
    deleteTeam
}