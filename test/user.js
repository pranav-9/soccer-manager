//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
const { deleteAllUsers } = require('../db/AppUsersQueries');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('User Registration', () => {

    before( (done) => { 
        done()
    });  

    /*
    * Test the /POST route
    */
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


});