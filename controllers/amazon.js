var amazon = require("amazon-product-api");

var client = amazon.createClient({
  awsId: process.env.AWSID,
  awsSecret: process.env.AWSSECRET,
  awsTag: process.env.AWSTAG,
});
// METODO PER CERCARE I PRODOTTI IN AMAZON
const searchAmazon = async (req, res) => {
  const { searchKeywords } = req.body;
  console.log(`Searching ${searchKeywords}`);
  client
    .itemSearch({
      keywords: searchKeywords,
      searchIndex: "All", // Puoi specificare una categoria specifica
    })
    .then((results) => {
      // Gestisci la risposta dell'API
      console.log(results);
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = {
  searchAmazon,
};

/*if (!email || typeof email !== "string") {
      return res
        .status(404)
        .json({ code: res.statusCode, message: "Email non valida" });
    }
  
    if (!password || typeof password !== "string") {
      return res
        .status(404)
        .json({ code: res.statusCode, message: "Password non valida" });
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ code: res.statusCode, message: "Utente non registrato" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { id: user._id, username: user.email },
        process.env.JWT_SECRET
      );
      return res.status(200).json({ code: res.statusCode, jwt: token });
    }
    return res
      .status(404)
      .json({ code: res.statusCode, message: "Email o Password errata" }); */
