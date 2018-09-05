const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

const todos = [
    {
        _id: new ObjectID(),
        text: 'First test todo'
    
    }, 
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: 'true',
        completeAt: 333
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});


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
    });
});