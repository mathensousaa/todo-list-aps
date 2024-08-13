# TODO-List APS

Este repositório contém a implementação de um Sistema de Lista de Tarefas (TODO-List) refatorado com foco em boas práticas de arquitetura de software. Este projeto foi desenvolvido como parte do trabalho final da disciplina de Arquitetura e Programação de Software no IFSP - campus Jacareí.

## Implementação

O sistema foi desenvolvido em TypeScript, utilizando o paradigma de Programação Orientada a Objetos (POO). Diversos padrões de design foram aplicados para garantir um código modular, escalável e fácil de manter.

## Design Patterns Utilizados

1. **Strategy Pattern**:
   - Utilizado para definir diferentes estratégias de persistência de dados (`SQLiteStrategy`, `LocalStorageStrategy`), permitindo que o sistema mude dinamicamente a forma como os dados são armazenados sem precisar alterar a lógica principal.

2. **Factory Pattern**:
   - Implementado para criar instâncias dos repositórios e serviços de maneira centralizada, facilitando a injeção de dependências e o gerenciamento das instâncias ao longo do sistema.

3. **Singleton Pattern**:
   - Algumas classes que lidam com recursos compartilhados, como os serviços de notificação e a conexão com o banco de dados, foram implementadas como Singletons para garantir que apenas uma instância dessas classes exista em todo o sistema.

4. **MVC (Model-View-Controller)**:
   - O sistema segue o padrão MVC, separando claramente a lógica de negócio (Model), a lógica de apresentação (View) e o controle da aplicação (Controller). Isso facilita a manutenção e a escalabilidade do sistema.

5. **Observer Pattern**:
   - Implementado para a comunicação entre componentes da interface do usuário, permitindo que as Views sejam atualizadas automaticamente quando os modelos de dados são modificados.

## Estrutura do Projeto

- **src/models**: Contém as classes que representam os modelos de dados do sistema, como `Tarefa`, `Categoria`, etc.
- **src/controllers**: Contém os controladores que orquestram a lógica de negócio e comunicação entre Models e Views.
- **src/views**: Contém as diferentes Views do sistema, responsáveis por renderizar a interface do usuário.
- **src/repositories**: Contém os repositórios responsáveis por persistir e recuperar dados, utilizando diferentes estratégias de persistência.
- **src/services**: Contém os serviços que encapsulam funcionalidades auxiliares e regras de negócio específicas.
- **src/strategies**: Contém as diferentes implementações de estratégias de persistência, como `SQLiteStrategy` e `LocalStorageStrategy`.
