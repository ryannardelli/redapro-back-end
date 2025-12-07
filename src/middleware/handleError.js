function handleError(err, req, res, next) {
    console.log(err); // para debug / log
    if(err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: "Erro interno do servidor" });
}

module.exports = handleError;