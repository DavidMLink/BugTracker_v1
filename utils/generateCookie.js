
const generateCookie = (Token, res) => {
    res.cookie('TOKEN', Token, {
        expires: new Date(Date.now() + 8 * 3600000), // Expires in 8 hours
        httpOnly: true
    });
}

export default generateCookie
