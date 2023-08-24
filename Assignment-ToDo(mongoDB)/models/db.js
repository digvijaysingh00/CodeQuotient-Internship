
const mongoose = require("mongoose");

module.exports.init = async function() {
    await mongoose.connect("mongodb+srv://digvijaysinghrajput12345:digvijay12345@cluster0.nxmjbzy.mongodb.net/superCodersGlobal?retryWrites=true&w=majority");
};
