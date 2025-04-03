export function checkIDMiddlewares(req, res, next)  {
    const id = parseInt(req.params.id);
    const users = readData();
    const user = users.find(user => user.id === id);
    if (user) {
        next();
    } else {
        res.status(404).send('ID not found')
    }
    next();
}