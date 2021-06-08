//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
let user_token = null ;
let admin_token = null ;


chai.use(chaiHttp);
//Our parent block
describe('User Registration', () => {

    before( (done) => { 
        done()
    });  
    
    describe('/POST user - register', () => {

        it('wrong body send', (done) => {
            let user = {
                email: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954
            }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.be.a('string').eql('"name" is required')
                done();
            });
        });

    });

    describe('/POST user - login', () => {

        it('user login', (done) => {
            let user = {
                email: "user@gmail.com",
                password: "password"
            }
        chai.request(server)
            .post('/api/user/login')
            .send(user)
            .end((err, res) => {
                    res.should.have.status(200);
                    user_token = res.text;
                    console.log(user_token,getUserToken());
                done();
            });
        });

    });

    describe('/POST admin - login', () => {

        it('admin login', (done) => {
            let user = {
                email: "admin@gmail.com",
                password: "password"
            }
        chai.request(server)
            .post('/api/user/login')
            .send(user)
            .end((err, res) => {
                    res.should.have.status(200);
                    admin_token = res.text;
                done();
            });
        });

    });


});

const getUserToken = () => {
    return user_token;
}

const getAdminToken = () => {
    return admin_token;
}

module.exports = {
    getUserToken,
    getAdminToken
}