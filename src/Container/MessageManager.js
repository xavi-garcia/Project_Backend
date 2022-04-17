const database = require ('../options/db');

class MessageManager {
  getAll = async () => {
    let messages = await database("messages").select("*");
    console.log(messages);
    return { status: "success", payload: messages };
  };

  add = async (dataChat) => {
    let messages = await database("messages").insert(dataChat);
    console.log(messages);
    return { status: "success", payload: messages };
  };
}
module.exports = MessageManager;