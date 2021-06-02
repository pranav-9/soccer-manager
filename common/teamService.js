const { addTeam } = require("../db/TeamQueries")
const { createPlayer } = require('./playerService')

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
            await createPlayer(savedTeam.id,'gk');
        }
        for (let index = 0; index < 6; index++) {
            await createPlayer(savedTeam.id,'def');
        }
        for (let index = 0; index < 6; index++) {
            await createPlayer(savedTeam.id,'mid');
        }
        for (let index = 0; index < 5; index++) {
            await createPlayer(savedTeam.id,'att');
        }

    } catch (error) {
        throw error;    
    }



    return;



}

module.exports = {
    initializeTeam
}