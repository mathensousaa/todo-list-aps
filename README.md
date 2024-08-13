# TODO-List APS

Este repositório contém a implementação de um Sistema de Lista de Tarefas (TODO-List) refatorado com foco em boas práticas de arquitetura de software. Este projeto foi desenvolvido como parte do trabalho final da disciplina de Arquitetura e Programação de Software no IFSP - campus Jacareí.

## Implementação

O sistema foi desenvolvido em TypeScript, utilizando o paradigma de Programação Orientada a Objetos (POO). Diversos padrões de design foram aplicados para garantir um código modular, escalável e fácil de manter.

## Design Patterns Utilizados

1. **MVC (Model-View-Controller)**:
   - O sistema segue o padrão MVC, separando claramente a lógica de negócio (Model), a lógica de apresentação (View) e o controle da aplicação (Controller). Isso facilita a manutenção e a escalabilidade do sistema.
     
2. **Strategy Pattern**:
   - Utilizado para definir diferentes estratégias de persistência de dados (`SQLiteStrategy`, `LocalStorageStrategy`), permitindo que o sistema mude dinamicamente a forma como os dados são armazenados sem precisar alterar a lógica principal.

3. **Repository Pattern**:
   - Usado para abstrair a lógica de acesso a dados, oferecendo uma interface consistente para manipulação de dados em diferentes fontes, como bancos de dados SQLite ou armazenamento local (LocalStorage). Os repositórios (`CategoriaRepository`, `TarefaRepository`, `CorRepository`) atuam como intermediários entre os dados da aplicação e as camadas superiores, promovendo a separação de responsabilidades.

## Estrutura do Projeto

- **src/models**: Contém as classes que representam os modelos de dados do sistema, como `Tarefa`, `Categoria`, etc.
- **src/controllers**: Contém os controladores que orquestram a lógica de negócio e comunicação entre Models e Views.
- **src/views**: Contém as diferentes Views do sistema, responsáveis por renderizar a interface do usuário.
- **src/repositories**: Contém os repositórios responsáveis por persistir e recuperar dados, utilizando diferentes estratégias de persistência.
- **src/services**: Contém os serviços que encapsulam funcionalidades auxiliares e regras de negócio específicas.
- **src/strategies**: Contém as diferentes implementações de estratégias de persistência, como `SQLiteStrategy` e `LocalStorageStrategy`.

## Como Rodar o Sistema Localmente

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Passos

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/todo-list-aps.git
   ```
