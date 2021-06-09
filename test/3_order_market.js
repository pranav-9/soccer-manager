//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

let { getUserToken, getAdminToken } = require('./0_AppUser');
const { getUserPlayerID } = require('./1_team');
// const wrong_token = 'wrong';
// let player_id = null;
// let user_id = 1;
let user_token = null;
let admin_token = null;
let user_player_id = null;


chai.use(chaiHttp);
//Our parent block
describe('Order Unit Testing', () => {

    before( (done) => { 
        user_token = getUserToken();
        admin_token = getAdminToken();
        user_player_id = getUserPlayerID();
        // console.log(" tokens : ", user_token, admin_token , user_player_id);
        done()
    });      
    

    describe('/Post sell order - user', () => {
        it('post player by user token', (done) => {     
            let player = {
                "player_id" : user_player_id,
                "type" : "SELL",
                "price" : 1000020.95
            };
        chai.request(server)
            .post('/api/order')
            .set({ "auth-token": user_token })
            .send(player)
            .end((err, res) => {
                    // console.log(res.body);
                    // console.log(res.text);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('type').eql('SELL');
                    res.body.should.have.property('price').eql('1000020.95');                    
                    
                done();
            });
        });
    });

    describe('/get market - user', () => {
        it('get market user token', (done) => {    
        // this.timeout(5000);
            
        chai.request(server)
            .get('/api/market')
            .set({ "auth-token": user_token })
            .send()
            .end((err, res) => {
                    console.log(res.body);
                    // console.log(res.text);
                    res.should.have.status(200);
                    res.body.should.be.a('array');            
                    
                done();
            });
        }).timeout(10000);
    });

});