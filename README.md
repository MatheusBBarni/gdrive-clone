# Google Drive Clone - Semana JS Expert 5.0

Professor: [Erick Wendel](https://www.youtube.com/channel/UCh84012dEUE076wM2CVFN9A)

Seja bem vindo(a) à quinta Semana Javascript Expert. Este é o código inicial para iniciar nossa jornada.

## Checklist Features

- Web API
    - [x] Deve listar arquivos baixados
    - [x] Deve receber stream de arquivos e salvar em disco
    - [x] Deve notificar sobre progresso de armazenamento de arquivos em disco 
    - [ ] Deve permitir upload de arquivos em formato image, video ou audio
    - [ ] Deve atingir 100% de cobertura de código em testes

- Web App 
    - [ ] Deve listar arquivos baixados
    - [ ] Deve permitir fazer upload de arquivos de qualquer tamanho
    - [ ] Deve ter função de upload via botão
    - [ ] Deve exibir progresso de upload 
    - [ ] Deve ter função de upload via drag and drop



## Desafios para alunos pós projeto

1. *Backend*: Salvar o arquivo na AWS ou qualquer serviço de storage
     - Nosso projeto hoje armazena arquivos em disco. o desafio é você via Stream, fazer upload para algum serviço na nuvem
     - Como plus, manter 100% de code coverage, ou seja, crie testes para sua nova feature
2. *Frontend*: Adicionar testes no frontend e alcançar 100% de code coverage
    - Você aprendeu como fazer testes no backend. Usar o mesmo processo para criar testes unitários no frontend com Jest 
    - Caso tenha duvidas, acesse o [exemplo](https://github.com/ErickWendel/tdd-frontend-example) e deixe uma estrela!
3. *Infraestrutura*: Publicar aplicação com seu SSL customizado em máquina virtual
    - Você aprendeu a gerar SSL local, o desafio é você criar um certificado (pode ser com o *Let's Encrypt*) e adicionar na sua aplicação

### Considerações
- Tire suas dúvidas sobre os desafios em nossa comunidade, o objetivo é você aprender de forma divertida. Surgiu dúvidas? Pergunte por lá!

- Ao completar qualquer um dos desafios, envie no canal **#desafios** da comunidade no **Discord**

## Créditos ao Layout <3

- O Layout foi adaptado a partir do projeto do brasileiro [Leonardo Santo](https://github.com/leoespsanto) disponibilizado no [codepen](https://codepen.io/leoespsanto/pen/KZMMKG). 

## FAQ 
- `NODE_OPTIONS` não é um comando reconhecido pelo sistema, o que fazer?
    - Se você estiver no Windows, a forma de criar variáveis de ambiente é diferente. Você deve usar a palavra `set` antes do comando. 
    - Ex: `    "test": "set NODE_OPTIONS=--experimental-vm-modules && npx jest --runInBand",`

- Certificado SSL é inválido, o que fazer?
    - Esse erro acontece porque gerei um certificado atrelado ao usuário da minha máquina.
    - Você pode clicar em prosseguir no browser e usar o certificado invalido que o projeto vai continuar funcionando, mas se quiser gerar o seu próprio, escrevi o passo a passo em [./certificates](./certificates)

- Rodei `npm test` mas nada acontece, o que fazer?
    - Verifique a versão do seu Node.js. Estamos usando na versão 16.8. Entre no [site do node.js](https://nodejs.org) e baixe a versão mais recente.
