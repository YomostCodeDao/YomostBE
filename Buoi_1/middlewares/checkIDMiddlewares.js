export function checkIDMiddlewares(req, res, next) {
    const id = parseInt(req.params.id);
    const { name, age } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        res.status(400).send('Name phai la chuoi khong rong');
    }
    if (!age || typeof age !== 'number' || age <= 0) {
        res.status(400).send('Tuoi khong hop le')
    }

    const users = readData();
    const user = users.find(user => user.id === id);

    if (!user) {
        res.status(404).send('ID not found')
    }
    next();
}
