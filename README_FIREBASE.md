# Musas — Firebase + Google Login + confirmação por e-mail

Este projeto substitui o Supabase por Firebase Authentication + Cloud Firestore e adiciona login com Google. O envio de e-mail usa EmailJS porque Cloud Functions/Extensions do Firebase exigem o plano Blaze para deploy; para um projeto acadêmico pequeno, EmailJS é a configuração mais simples sem backend próprio.

## 1. Criar o projeto no Firebase
1. Acesse https://console.firebase.google.com e clique em **Adicionar projeto**.
2. Crie um projeto, por exemplo `musas-salao`.
3. Na página inicial do projeto, clique no ícone **Web (`</>`)** e registre o app.
4. Copie o objeto `firebaseConfig` mostrado pelo Firebase.
5. Abra `firebase-config.js` e substitua todos os valores `COLE_AQUI`/`SEU_PROJETO` pelos dados copiados.
6. Em `APP_CONFIG.employeeEmail`, informe o e-mail que deve receber avisos de novos agendamentos.

## 2. Ativar autenticação por e-mail e Google
1. Firebase Console > **Authentication** > **Get started**.
2. Em **Sign-in method**, ative **Email/Password**.
3. Ative também **Google** e selecione o e-mail de suporte do projeto.
4. Salve.
5. Se publicar em outro domínio, adicione esse domínio em **Authentication > Settings > Authorized domains**.

## 3. Criar o Firestore
1. Firebase Console > **Firestore Database** > **Create database**.
2. Escolha a região mais próxima dos usuários.
3. Crie o banco.
4. Abra a aba **Rules** e substitua as regras pelo conteúdo do arquivo `firestore.rules`.
5. Clique em **Publish**.

## 4. Transformar uma conta em funcionário
Por segurança, todo cadastro novo nasce como `cliente`.
1. Entre no site uma vez com a conta que será funcionária.
2. Firebase Console > Firestore > coleção `usuarios`.
3. Abra o documento dessa conta.
4. Troque o campo `tipo` de `cliente` para `funcionario`.
5. Ao fazer login novamente, essa conta será redirecionada para `dashboard.html`.

## 5. Configurar os e-mails
### Opção usada neste projeto: EmailJS
1. Acesse https://www.emailjs.com e crie uma conta.
2. Crie um **Email Service** e conecte a conta que enviará as mensagens.
3. Crie um **Email Template**.
4. No campo destinatário do template, use `{{to_email}}`.
5. Exemplo de corpo do template:

```
Olá, {{recipient_name}}!

{{tipo_mensagem}}

Cliente: {{cliente_nome}}
E-mail: {{cliente_email}}
Serviço: {{servico}}
Data: {{data}}
Horário: {{horario}}
Valor: {{valor}}

Musas
```

6. Copie **Service ID**, **Template ID** e **Public Key**.
7. Abra `email-config.js` e preencha os três campos.
8. Ao confirmar um agendamento, o sistema salva primeiro no Firestore e depois envia:
   - um e-mail para o cliente;
   - um e-mail para o endereço configurado em `APP_CONFIG.employeeEmail`.
9. Se o envio de e-mail falhar, o agendamento continua salvo; a tela informa que somente o e-mail falhou.

## 6. Rodar corretamente
Não abra `index.html` com duplo clique (`file://`). O Google Login precisa rodar em um domínio/localhost autorizado.

No VS Code, a forma mais simples é usar a extensão **Live Server** e abrir a pasta por ela.

Também pode usar:

```bash
python -m http.server 5500
```

Depois acesse:

```
http://localhost:5500
```

## 7. Como ficou o fluxo
- Cliente cadastra com e-mail/senha ou entra com Google.
- O perfil é criado em `usuarios` com `tipo: cliente`.
- Cliente escolhe serviço, data e horário.
- O sistema verifica os horários já usados no Firestore.
- Ao confirmar, cria um documento em `agendamentos`.
- Cliente e funcionário recebem a confirmação por e-mail.
- O `dashboard.html` usa listener em tempo real; portanto novos agendamentos aparecem automaticamente sem recarregar a página.
- Conta com `tipo: funcionario` entra no dashboard; cliente não consegue abrir o dashboard.

## Observação sobre aniversário + Google
O Google não fornece a data de nascimento automaticamente para este login. Portanto, quem entrar somente com Google ficará sem desconto de aniversário até adicionarmos uma tela de **Meu Perfil** para informar a data de nascimento. O cadastro tradicional já salva a data normalmente.

## Próxima integração planejada
Este pacote deixa Firebase, login Google, separação cliente/funcionário, Firestore, agenda em tempo real e e-mails funcionando. O próximo passo é ligar o dashboard completo do Musas (Financeiro, Estoque, pagamento, taxas da maquininha e gráficos) às mesmas coleções do Firebase.


## Dashboard Dark com gráficos

Esta versão usa `dashboard.html` com o visual dark completo, cards financeiros, gráficos, agenda em tempo real, estoque e financeiro.

Depois de substituir a pasta, publique novamente o conteúdo de `firestore.rules` no Firebase.

## Correção Agenda / Pagamentos
Nesta versão, os botões Confirmar, Atender e Cancelar mostram erros no próprio dashboard caso o Firestore bloqueie uma operação. O pagamento agora é salvo em lote (batch), evitando criar pagamento sem lançar o financeiro ou vice-versa.

Durante os testes locais, publique `firestore.rules`. Ele permite as operações do painel para usuários autenticados. Para uma publicação real, use `firestore.rules_PRODUCAO.txt` e valide o controle de funcionários antes.

## Serviços editáveis pelo Dashboard

A aba **Serviços** agora usa a coleção `servicos` do Firestore. O funcionário pode adicionar, editar preço/duração, desativar/ativar e excluir serviços direto no Dashboard. A página de agendamento carrega apenas os serviços ativos e usa os valores atuais do Firestore.

Na primeira abertura do Dashboard, se a coleção `servicos` estiver vazia, os quatro serviços iniciais são criados automaticamente.
