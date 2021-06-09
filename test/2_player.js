//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

let { getUserToken, getAdminToken } = require('./0_AppUser');
const { getUserPlayerID } = require('./1_team');
const wrong_token = 'wrong';
let player_id = null;
let user_id = 1;
let user_token = null;
let admin_token = null;
let user_player_id = null;


chai.use(chaiHttp);
//Our parent block
describe('Player Unit Testing', () => {

    before( (done) => { 
        user_token = getUserToken();
        admin_token = getAdminToken();
        user_player_id = getUserPlayerID();
        // console.log(" tokens : ", user_token, admin_token , user_player_id);
        done()
    });  
    
    describe('/Get players - admin', () => {
        it('get all players -admin', (done) => {       
            console.log(admin_token);     
            chai.request(server)
                .get('/api/player')
                .set({ "auth-token": admin_token })
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                done();
                });
        });
    });

    describe('/Get players - user', () => {
        it('get players', (done) => {            
        chai.request(server)
            .get('/api/player')
            .set({ "auth-token": user_token })
            .send()
            .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.be.a('string').eql('Do not have permission to access'); 
                done();
            });
        });
    });

    describe('/Post player - admin', () => {
        it('post player by admin token', (done) => {     
            let player = {        
                "firstname": "Kuzey",
                "lastname": "Erçetin",
                "country": "SPAIN",
                "age": 39,
                "role": "GK",
                "marketvalue": "1000001"
        };
        chai.request(server)
            .post('/api/player')
            .set({ "auth-token": admin_token })
            .send(player)
            .end((err, res) => {
                    // console.log(res.body);
                    // console.log(res.text);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('country').eql('SPAIN');
                    res.body.should.have.property('marketvalue').eql('1000001');                    
                    player_id = res.body.id;
                done();
            });
        });
    });

    describe('/Patch player - admin', () => {
        it('patch player by admin token', (done) => {     
            let player = {
                firstname: "name_junit_patched"
        };       
        chai.request(server)
            .patch('/api/player')
            .set({ "auth-token": admin_token })
            .query({"id": player_id})
            .send(player)
            .end((err, res) => {
                    // console.log(res.body);
                    // console.log(res.text);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('firstname').eql('name_junit_patched');
                done();
            });
        });
    });

    describe('/Patch player - user', () => {
        it('patch player by user token', (done) => {     
            let player = {
                firstname: "name_junit_patched_2"
        };       
        chai.request(server)
            .patch('/api/player')
            .set({ "auth-token": user_token })
            .query({"id": user_player_id})
            .send(player)
            .end((err, res) => {
                    console.log(res.body);
                    console.log(res.text);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('firstname').eql('name_junit_patched_2');
                done();
            });
        });
    });

    describe('/delete player - admin', () => {
        it('delete player by admin token', (done) => {   
        chai.request(server)
            .delete('/api/player')
            .set({ "auth-token": admin_token })
            .query({"id": player_id})
            .send()
            .end((err, res) => {
                    console.log(res.body);
                    // console.log(res.text);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                done();
            });
        });
    });

});