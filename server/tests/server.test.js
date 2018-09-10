const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {User} = require('./../models/users');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            })
            .catch((e) => done(e));
        });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done (err);
            }
            
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
        });

});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it ('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('should return 400 for non-object ids', (done) => {
        var id = '123';

        request(app)
            .get(`/todos/${id}`)
            .expect(400)
            .end(done);
    });

});


describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        var id = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });
    it('Should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('should return 400 if object id is invalid', (done) => {
        var id = '123';
        request(app)
            .delete(`/todos/${id}`)
            .expect(400)
            .end(done);
    });
});


describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'Hassan';
        var completed = true;

        request(app)
            .patch(`/todos/${id}`)
            .expect(200)
            .send({text, completed})
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completeAt).toBeA('number');
            })
            .end(done);
    });
    it('should clear completeAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var text = 'Hassan';
        var completed = false;

        request(app)
            .patch(`/todos/${id}`)
            .expect(200)
            .send({text, completed})
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completeAt).toNotExist();
            })
            .end(done);
    })
});

describe('GET /users/me', () => {
    it('should return user if athenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authneticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
        });   
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'hassanansari17@live.com';
        var password = 'abc123455';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end(done);
    });
    it('should return validation errors id request is invalid', (done) => {
        var email = 'hassanansari17@live.com';
        var password = '123';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
    it('should not create user if email in use', (done) => {
        var email = users[0].email;
        var password = 'abc123456';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app) 
            .post('/users/login')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end(done);
            });

    it('should reject invalid login', (done) => {
        request(app) 
            .post('/users/login')
            .send({
                email: '1234@live.com',
                password: 12344566
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end(done);
        });

    });