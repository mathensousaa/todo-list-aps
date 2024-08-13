import "tailwindcss/tailwind.css";

import { CategoriaController, TarefaController } from "./controllers";
import { LocalStorageStrategy } from "./persistence";
import { CategoriaRepository, TarefaRepository } from "./repositories";
import {
  CorCategoriaService,
  NotificacaoService,
  RepeticaoService,
} from "./services";
import { CategoriaView } from "./views/categoria-view";
import { GlobalView } from "./views/global-view";
import { QuadroTarefasView } from "./views/quadro-tarefas-view";
import { TarefaView } from "./views/tarefa-view";
import { CorCategoriaRepository } from "./repositories/cor-categoria-repository";

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

const corCategoriaRepository = new CorCategoriaRepository(persistenciaStrategy);

const corService = new CorCategoriaService(corCategoriaRepository);

const categoriaController = new CategoriaController(
  categoriaRepository,
  corService
);

const globalView = new GlobalView();

const quadroTarefasView = new QuadroTarefasView(tarefaController);

const categoriaView = new CategoriaView(categoriaController, globalView);

const tarefaView = new TarefaView(
  tarefaController,
  categoriaController,
  quadroTarefasView,
  categoriaView,
  globalView
);
