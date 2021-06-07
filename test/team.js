//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');

const admin_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE2MjMwNTgwMjl9.z9essSBzgdvi1srIJw2u-Oq1hE-TQ9vymAHJ4X4YgyU';
const user_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiaWF0IjoxNjIzMDc3MjI3fQ.xgpnhhnxvLvcvvZlWEC7DKdMZhT1I5hj69F696nRnr8';
const wrong_token = 'wrong';


chai.use(chaiHttp);
//Our parent block
describe('Team Unit Testing', () => {

    before( (done) => { 
        done()
    });  
    
    describe('/Get teams - admin', () => {
        it('get all teams -admin', (done) => {            
            chai.request(server)
                .get('/api/team')
                .set({ "auth-token": admin_token })
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                done();
                });
        });
    });

    describe('/Get team - user', () => {
        it('get team of user', (done) => {            
        chai.request(server)
            .get('/api/team')
            .set({ "auth-token": user_token })
            .send()
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('user_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('country');
                    res.body.should.have.property('value');
                    res.body.should.have.property('budget_left');
                    res.body.should.have.property('created_at');
                    res.body.should.have.property('players');               
                done();
            });
        });
    });

    describe('/Get team - bad token', () => {
        it('get team for user with bad token', (done) => {            
        chai.request(server)
            .get('/api/team')
            .set({ "auth-token": wrong_token })
            .send()
            .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');  
                    res.body.should.have.property('name').eql('JsonWebTokenError');
                    res.body.should.have.property('message').eql('jwt malformed');       
                done();
            });
        });
    });

    describe('/Post team - user', () => {
        it('post team by user token', (done) => {            
        chai.request(server)
            .post('/api/team')
            .set({ "auth-token": user_token })
            .send()
            .end((err, res) => {
                    console.log(res.text);
                    res.should.have.status(400);
                    res.text.should.be.a('string').eql('Do not have permission to access'); 
                done();
            });
        });
    });

    describe('/Post team - admin', () => {
        it('post team by admin token', (done) => {     
            let team = {
                "name": "team_name_junit",
                country: "INDIA"
        };       
        chai.request(server)
            .post('/api/team')
            .set({ "auth-token": admin_token })
            .send(team)
            .end((err, res) => {
                    // console.log(res.body);
                    // console.log(res.text);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('user_id').eql(null);
                    res.body.should.have.property('name').eql('team_name_junit');
                    res.body.should.have.property('country').eql('INDIA');
                    res.body.should.have.property('value').eql('0');
                    res.body.should.have.property('budget_left').eql('0');
                done();
            });
        });
    });


});