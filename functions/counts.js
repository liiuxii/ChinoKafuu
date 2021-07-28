module.exports = {
    name: "count",
    func: function (message) {
        const fs = require("fs");

        let rawData = fs.readFileSync("../data/countingData.json");
        let countingData = JSON.parse(rawData);
        if (!Number(message.content)) return;
        if (countingData.counter === "0" || !countingData.counter) {
            if (message.content !== "1") return;
            countingData.author = message.author.tag;
            countingData.counter = message.content;
            let data = JSON.stringify(countingData, null, 2);
            fs.writeFileSync("../data/countingData.json", data);
            message.react("✅");
            return;
        }
        if (message.author.tag !== countingData.author) {
            if (message.content !== Number(countingData.counter) + 1) {
                countingData.counter = "0";
                countingData.author = "";
                let data = JSON.stringify(countingData, null, 2);
                fs.writeFileSync("../data/countingData.json", data);
                message.react("❌");
                return;
            } else {
                countingData.counter = message.content;
                countingData.author = message.author.tag;
                let data = JSON.stringify(countingData, null, 2);
                fs.writeFileSync("../data/countingData.json", data);
                message.react("✅");
                return;
            }
        }
    },
};
