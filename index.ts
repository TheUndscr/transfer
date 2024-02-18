import * as fs from "fs";
import * as readline from "readline";

const rl = readline.promises.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(question: string) {
    const result = await rl.question(question);
    return result;
}

async function getPath(question: string) {
    const path = await askQuestion(question);

    const exists = fs.existsSync(path);
    if (!exists) {
        console.log("Path does not exist!");
        return await getPath(question);
    }

    return path;
}

async function doTheFunnyThing(fileBuffer: fs.ReadStream, output: string) {
    const newFile = fs.createWriteStream(output);
    const pipe = fileBuffer.pipe(newFile);
    pipe.once("error", (err) => {
        console.error("An error occurred while writing the file: ", err);
    });
    pipe.once("finish", () => {
        console.log("Done!!!!");
    });
}

async function main() {
    const filePath = await getPath("Enter a file path: ");
    const fileStream = fs.createReadStream(filePath);

    const outputPath = await getPath("Enter an output path (including what the file name and extension should be, Ex: /documents/file.mp4): ");
    doTheFunnyThing(fileStream, outputPath);
}

main();