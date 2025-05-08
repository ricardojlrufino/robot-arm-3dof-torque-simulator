# Simulador de Braço Robótico

Um simulador de braço robótico em React para cálculo de torques e cinemática em tempo real. Esta aplicação permite visualizar um braço robótico de 3 eixos e calcular os torques necessários em cada junta com base nos comprimentos, ângulos e massas definidos pelo usuário.

## Funcionalidades

- Visualização interativa do braço robótico em SVG
- Controle de ângulo para cada link do braço
- Configuração de comprimentos e massas
- Cálculo em tempo real de torques e coordenadas
- Indicadores visuais de torque
- Controles de zoom e arrastar para melhor visualização
- Exibição de dados em formato tabular

## Tecnologias Utilizadas

- React.js
- Context API para gerenciamento de estado
- Tailwind CSS para estilização
- SVG para visualização do braço robótico

## Pré-requisitos

- Node.js (versão 14.x ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/robotic-arm-simulator.git
   cd robotic-arm-simulator
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   # ou
   yarn start
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## Estrutura do Projeto

A aplicação foi organizada em camadas:

- **Camada de Contexto**: Gerenciamento de estado
- **Camada de Utilidades**: Funções de cálculo e constantes
- **Camada de Componentes**: Elementos de UI organizados por função
- **Camada de Aplicação**: Integração de todas as outras camadas

Para mais detalhes sobre a estrutura, consulte o documento [Estrutura do Projeto](./STRUCTURE.md).

## Como Usar

1. Ajuste os controles de ângulo no painel esquerdo para movimentar o braço
2. Modifique os comprimentos dos links conforme necessário
3. Altere as massas para ver o impacto nos torques
4. Use os controles de zoom e arraste para melhorar a visualização
5. Observe como os torques mudam em tempo real no painel de informações

## Cálculos Físicos

O simulador calcula os torques com base nas seguintes considerações:
- Apenas forças gravitacionais são consideradas
- Os torques são calculados usando o braço de alavanca horizontal
- Conversão entre unidades: Nm (Newton-metro) e kgf·cm (quilograma-força centímetro)

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Autor

Ricardo JL Rufino