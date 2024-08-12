import { CategoriaController, TarefaController } from "./controllers";
import { LocalStorageStrategy } from "./persistence";
import { CategoriaRepository, TarefaRepository } from "./repositories";
import { CorService, NotificacaoService, RepeticaoService } from "./services";

const persistenciaStrategy = new LocalStorageStrategy();

const tarefaRepository = new TarefaRepository(persistenciaStrategy);

const notificacaoService = new NotificacaoService();
const repeticaoService = new RepeticaoService();

const tarefaController = new TarefaController(
  tarefaRepository,
  notificacaoService,
  repeticaoService
);

const categoriaRepository = new CategoriaRepository(persistenciaStrategy);

const corService = new CorService(persistenciaStrategy);

const categoriaController = new CategoriaController(
  categoriaRepository,
  corService
);
