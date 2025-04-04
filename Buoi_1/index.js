import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { checkIDMiddlewares } from './middlewares/checkIDMiddlewares';
const app = express()
const port = 2004
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('Hello World!')
})

//Hàm đọc dữ liệu từ file
const readData = () => {
    const data = fs.readFileSync('./users.json');
    return JSON.parse(data);
};

//Hàm ghi dữ liệu vào file
const writeData = (users) => {
    fs.writeFileSync('./users.json', JSON.stringify(users));
}

//API coi dữ liệu tổng / dữ liệu chi tiết ntn
app.get('/users', (req, res) => {
    const users = readData();
    if (users.length === 0) {
        res.status(500).send('No data')
    } else {
        res.status(200).send(users);

    }
});


//API lấy thông tin người dùng theo ID
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const users = readData();
    const user = users.find(user => user.id == id);
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send('ID is not found');
    }
});


//API lấy ds người dùng sắp xếp theo ID (tăng dần) / (giảm dần)
app.get('/users/sort', (req, res) => {
    const users = readData();
    const sort = req.query.sort || 'desc';
    if (sort === 'asc') {
        users.sort((a, b) => a.id - b.id);
    } else {
        users.sort((a, b) => b.id - a.id);
    }
    res.status(200).send(users);
})



//API sửa thông tin người dùng
app.put('/users/:id', checkIDMiddlewares, (req, res) => {
    const id = parseInt(req.params.id)
    const { name, age } = req.body;
    const users = readData();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).send('ID not found');
    }
    if (name) {
        users[userIndex].name = name;
    }
    if (age) {
        users[userIndex].age = age;
    }
    writeData(users);
    return res.status(200).send(users[userIndex]);
});

//API xóa người dùng
app.delete('/users/:id', checkIDMiddlewares, (req, res) => {
    const id = parseInt(req.params.id);
    const users = readData();
    const newUsers = users.filter(user => user.id !== id);
    writeData(newUsers);
    res.status(200).send(newUsers);
});

//API thêm người dùng
app.post('/users', (req, res) => {
    const { name, age } = req.body;
    const newId = users[users.length - 1].id + 1;
    const newUser = { id: newId, name, age };
    users.push(newUser);
    writeData(newUser);
    res.send(newUser);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(`http://localhost:${port}`);
})
