(async () => {
    const mongoose = require('mongoose');
    try {
        await mongoose.connect('mongodb://localhost:27017/Factura', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB Connected');
    } catch (e) {
        console.log(e);
    }
})();