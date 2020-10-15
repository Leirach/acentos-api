import * as dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

import * as express from 'express';
import * as mongoose from 'mongoose';

import { Request, Response, NextFunction} from 'express';
import { Model, model, Schema, Document } from 'mongoose';
import { exit } from 'process';

//DB

function initDB() {
  if (!process.env.MONGODB_URI) {
    console.error("No mongo URI found!");
    exit(1);
  }
  mongoose.connect(process.env.MONGODB_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(dc => {console.log('Connected to DB');})
  .catch(err => console.log(err));

  if (process.env.NODE_ENV !== 'production') {
      mongoose.set("debug", true);
  }
}

var WordSchema = new Schema({
  palabra: { type: String},
  silabas: { type: String},
  idxTonica: { type: Number },
  tilde: { type: Boolean },
  regla: { type: String},
  hiato: { type: Boolean },
  contexto: { type: String}
});

interface IWord extends Document {
  _id: string,
  palabra: string,
  silabas: string,
  idxTonica: number,
  tilde: boolean,
  regla: string,
  hiato: boolean,
  contexto: string
}

interface IWordModel extends Model<IWord>{}
let Words = model<IWord, IWordModel>('words', WordSchema)

// Express App
const app = express();
app.use('/words', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await Words.find();
    return res.status(200).json({data: data});
  } catch(err) {
    return res.status(400).json(err);
  }
});

app.set('port', process.env.PORT || 3000);

initDB();

app.listen(app.get('port'), () => {
  console.log(`App running on port ${app.get('port')}`)
})