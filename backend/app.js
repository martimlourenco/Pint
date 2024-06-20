const express = require('express');
//const Sequelize = require('sequelize');
const cors = require('cors');
const app = express();
const loginRoutes = require('./src/routes/loginRoutes');
const centroRoutes = require('./src/routes/centroRoute');
const eventoRoutes = require('./src/routes/eventosRoute');
const locaisRoutes = require('./src/routes/locaisRoute');
const forumRoutes = require('./src/routes/forumRoute');
const albumRoutes = require('./src/routes/albumFotosRoute');
const userRoutes = require('./src/routes/utilizadorRoute');
const areaRoutes = require('./src/routes/areaRoute');
const session = require('express-session');
const { SESSION_SECRET, PORT } = require('./src/config');
const sequelize = require('./src/models/database');
const multer = require('multer');
const path = require('path');
const AlbumFotos = require('./src/models/albumFotos');
const Area = require('./src/models/area');
const AreaLocal = require('./src/models/areaLocal');
const Centro = require('./src/models/centro');
const Comentarios = require('./src/models/comentarios');
const Eventos = require('./src/models/eventos');
const Forum = require('./src/models/forum');
const Fotos = require('./src/models/fotos');
const Locais = require('./src/models/locais');
const SubArea = require('./src/models/subArea');
const users = require('./src/models/users');
const ParticipantesEvento = require('./src/models/participantes_evento');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

const predefinedAreas = [
  { NOME_AREA: 'Gastronomia' },
  { NOME_AREA: 'Desporto' },
  { NOME_AREA: 'Saude' }
];

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso.');
    await sequelize.sync();
    for (const area of predefinedAreas) {
      const [areaInstance, created] = await Area.findOrCreate({
          where: { NOME_AREA: area.NOME_AREA },
          defaults: area
      });
      if (created) {
          console.log(`Área "${area.NOME_AREA}" criada`);
      } else {
          console.log(`Área "${area.NOME_AREA}" já existe`);
      }
  }
    console.log('Todos os modelos foram sincronizados com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};
app.post('/upload', upload.single('foto'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  console.log(req.file); 
  res.send('Arquivo recebido com sucesso');
})

app.use('/auth', loginRoutes);
app.use('/centro', centroRoutes);
app.use('/evento', eventoRoutes);
app.use('/locais', locaisRoutes);
app.use('/forum', forumRoutes);
app.use('/album', albumRoutes);
app.use('/user', userRoutes);
app.use('/area', areaRoutes);

syncDatabase();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
