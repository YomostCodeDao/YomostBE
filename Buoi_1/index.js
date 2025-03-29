const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
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


//API lấy ds người dùng sắp xếp theo ID (tăng dần) / (giảm dần)
app.get('/users/sort', (req, res) => {
    const users = readData();
    const sort = req.query.sort || 'desc';    
    if (sort === 'asc') {
        users.sort((a, b) => a.id - b.id);
    } else {
        users.sort((a, b) => b.id - a.id);
    }
    res.send(users);
})

//API coi dữ liệu tổng / dữ liệu chi tiết ntn
app.get('/users', (req, res) => {
    const users = readData();
    res.send(users);
});

//API sửa thông tin người dùng
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const users = readData();
    const index = users.findIndex(user => user.id == id);
    const user = users[index];
    const newUser = req.body;
    users[index] = { ...user, ...newUser };
    writeData(users);
    res.send(users);
});

//API xóa người dùng
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const users = readData();
    const newUsers = users.filter(user => user.id !== id);
    writeData(newUsers);
    res.send(newUsers);
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
    console.log('http://localhost:2004');
})
