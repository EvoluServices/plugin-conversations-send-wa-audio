const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const twilio = require("twilio");

const path = require("path");

// Substitua "sa-east-1" pela sua região, se diferente
const s3 = new S3Client({ region: "sa-east-1" });

exports.lambdaHandler = async function (event) {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  const fs = require("fs");
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const inputPath = `/tmp/${key.replace("uploads/", "")}`;
  const outputPath = `/tmp/converted-${key
    .replace("uploads/", "")
    .replace(".wav", ".mp3")}`;

  const downloadPath = path.join("/tmp", path.basename(key));

  const s3Stream = await s3.send(new GetObjectCommand(params));

  await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(downloadPath);
    s3Stream.Body.pipe(fileStream);
    s3Stream.Body.on("error", reject);
    fileStream.on("error", reject);
    fileStream.on("close", () => {
      resolve();
    });
  });

  const { execSync } = require("child_process");
  execSync(`ffmpeg -i ${inputPath} ${outputPath}`);

  if (fs.existsSync(outputPath)) {
    console.log("Conversão bem-sucedida!");
  } else {
    console.error("Erro na conversão.");
  }

  fs.readdir("/tmp", (err, files) => {
    if (err) throw err;
    console.log("Arquivos no /tmp:", JSON.stringify(files));
  });

  const uploadParams = {
    Bucket: bucket,
    Key: `converteds/${key.replace("uploads/", "").replace(".wav", ".mp3")}`,
    Body: fs.readFileSync(outputPath),
  };

  const uploadResult = await s3.send(new PutObjectCommand(uploadParams));

  console.log("Upload bem-sucedido:", JSON.stringify(uploadResult));

  const paramsUrlSigned = {
    Bucket: bucket,
    Key: `converteds/${key.replace("uploads/", "").replace(".wav", ".mp3")}`,
    Expires: 3600,
    ContentType: "audio/mp3",
  };

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand(paramsUrlSigned),
    {
      expiresIn: 3600,
    }
  );

  console.log("URL do objeto:", signedUrl);

  const headObjectResponse = await s3.send(new HeadObjectCommand(params));
  const taskSid = headObjectResponse.Metadata["task-sid"];

  console.log("taskSid", taskSid);
  const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  const taskAttributes = await client.taskrouter.v1
    .workspaces("WS404509c12dcc5a8ed06d1784ddbf8515")
    .tasks(taskSid)
    .fetch()
    .then((task) => {
      return JSON.parse(task.attributes);
    });
  const updatedAttributes = {
    ...taskAttributes,
    convertedFileUrl: signedUrl,
  };
  await client.taskrouter
    .workspaces("WS404509c12dcc5a8ed06d1784ddbf8515")
    .tasks(taskSid)
    .update({
      attributes: JSON.stringify(updatedAttributes),
    });

  console.log("task atualizada com sucesso");

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "deu certo" }),
  };
};
