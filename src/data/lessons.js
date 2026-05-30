// Conteúdo de todas as lições do MVP.
// Lições com company=true usam dados da empresa da criança no texto via {companyName} e {product}.

export const LESSONS = {
  // ── MÓDULO 1 ─────────────────────────────────────────────────────────────────
  'm1-oportunidade': {
    title: 'Encontrando uma oportunidade',
    exercises: [
      {
        type: 'mc',
        q: 'Em qual destas situações tem MAIS chance de uma boa oportunidade de negócio?',
        opts: [
          { e: '🛒', t: 'Padaria sem fila às 3h da tarde',               ok: false },
          { e: '🚗', t: 'Trânsito parado e ninguém vendendo nada na rua', ok: true  },
          { e: '🏖️', t: 'Praia vazia em dia de chuva',                   ok: false },
          { e: '📱', t: 'Loja de celular cheia no shopping',              ok: false },
        ],
        cf: 'Boa! Onde tem gente parada sem solução, tem oportunidade.',
        wf: 'Quase! Pensa: espera + sem alternativa = oportunidade!',
      },
      {
        type: 'match',
        q: 'Conecte o problema do cliente com a oportunidade que ele revela.',
        pairs: [
          { left: 'Esqueci o carregador e meu celular morreu na escola', right: 'Aluguel de carregadores no recreio' },
          { left: 'Minha mãe não tem tempo de fazer lanche',             right: 'Marmitex saudável entregue na escola' },
          { left: 'Odeio acordar cedo pra estudar prova',                right: 'App que resume matéria em 5 minutos' },
        ],
        cf: 'Perfeito! Você conectou todos os pares! 🎉',
      },
      {
        type: 'order',
        q: 'Coloque na ordem certa os passos para achar uma oportunidade:',
        items: [
          { id: 0, text: '👁️ Observe o que as pessoas reclamam' },
          { id: 1, text: '❓ Pergunte "por quê?" várias vezes' },
          { id: 2, text: '📝 Anote o problema mais comum' },
          { id: 3, text: '🧪 Teste uma solução simples e barata' },
        ],
        scrambled: [0, 2, 3, 1],
        cf: 'Ordem certa! É exatamente assim que funciona. 🚀',
      },
      {
        type: 'mc',
        q: 'Você está no recreio. 3 amigos desesperados com celular morto. Você tem R$50. O que faz?',
        opts: [
          { e: '🍔', t: 'Compra um lanche pra você',                                    ok: false },
          { e: '🚶', t: 'Ignora e vai jogar bola',                                       ok: false },
          { e: '🔌', t: 'Compra 5 carregadores baratos no camelô e aluga no recreio',    ok: true  },
          { e: '🗣️', t: 'Reclama com o diretor',                                        ok: false },
        ],
        cf: 'É isso! Você viu o problema, tinha o recurso e agiu. Mentalidade empreendedora!',
        wf: 'Erra-se aprendendo! O empreendedor usa o que tem pra resolver o que viu.',
      },
      {
        type: 'mc',
        q: 'Qual destas frases descreve MELHOR o que é uma oportunidade de negócio?',
        opts: [
          { e: '💡', t: 'Uma ideia genial que ninguém pensou antes',           ok: false },
          { e: '💰', t: 'Algo que só rico pode fazer',                          ok: false },
          { e: '🎯', t: 'Um problema real que pessoas têm e ninguém resolveu bem', ok: true },
          { e: '📋', t: 'Copiar o que está dando dinheiro',                    ok: false },
        ],
        cf: 'Empreendedor não inventa do zero — ele resolve dor de gente real.',
        wf: 'Tenta de novo! Empreendedorismo é sobre RESOLVER PROBLEMAS reais.',
      },
      {
        type: 'composite',
        q: 'Sua vez. Monte sua primeira oportunidade:',
        steps: [
          { q: 'Onde você vai olhar?',        opts: ['🏫 Escola', '🏘️ Bairro', '📱 Online'] },
          { q: 'Que problema você vê?',       opts: ['🔌 Celulares sem carga no recreio', '🍎 Lanche caro e pouco nutritivo', '📚 Difícil estudar resumindo'] },
          { q: 'Que solução simples você testa?', opts: ['📣 Falar com o diretor', '🔌 Alugar carregadores por R$1', '📸 Fazer vídeo pra internet'] },
        ],
        cf: 'Você acabou de fazer o que todo empreendedor faz: observar, identificar e propor.',
      },
    ],
  },

  'm1-valor': {
    title: 'Quem cria valor',
    exercises: [
      {
        type: 'mc',
        q: 'Quem cria valor em um negócio?',
        opts: [
          { e: '🤑', t: 'Quem tem mais dinheiro',                       ok: false },
          { e: '🎯', t: 'Quem resolve um problema melhor do que ninguém', ok: true  },
          { e: '📺', t: 'Quem faz mais propaganda',                      ok: false },
          { e: '🏢', t: 'Quem tem escritório maior',                     ok: false },
        ],
        cf: 'Isso! Valor vem de resolver problemas, não de ter mais recursos.',
        wf: 'Pensa melhor — valor não depende de dinheiro ou tamanho.',
      },
      {
        type: 'mc',
        q: 'João faz bolos e vende por R$30. Custa R$10 pra fazer. Qual é o valor que João cria?',
        opts: [
          { e: '🎂', t: 'O bolo em si',                                   ok: false },
          { e: '😊', t: 'A felicidade que o bolo traz + conveniência pra quem não sabe fazer', ok: true },
          { e: '💸', t: 'Os R$20 de lucro',                               ok: false },
          { e: '⏰', t: 'O tempo que levou pra fazer',                    ok: false },
        ],
        cf: 'Exato! O valor real é a experiência e a conveniência — o bolo é só o meio.',
        wf: 'Valor é mais do que o produto. É o que ele representa pra quem compra.',
      },
      {
        type: 'mc',
        q: 'Ana sabe desenhar muito bem. Como ela pode criar valor com isso?',
        opts: [
          { e: '🎨', t: 'Desenhar pra ela mesma se divertir',             ok: false },
          { e: '💼', t: 'Fazer logos e ilustrações pra negócios pequenos', ok: true  },
          { e: '🏠', t: 'Esperar alguém descobrir que ela sabe',          ok: false },
          { e: '📷', t: 'Postar no Instagram sem cobrar nada',            ok: false },
        ],
        cf: 'Perfeito! Habilidade + problema real de alguém = negócio.',
        wf: 'Habilidade sozinha não cria valor — precisa resolver um problema de alguém.',
      },
      {
        type: 'mc',
        q: 'Qual destes negócios cria MAIS valor por unidade vendida?',
        opts: [
          { e: '🍬', t: 'Balinhas a R$0,50 cada',                        ok: false },
          { e: '📚', t: 'Aula particular de matemática por R$80/hora',    ok: true  },
          { e: '🧃', t: 'Suco natural por R$5',                           ok: false },
          { e: '📌', t: 'Marcadores de livro por R$3',                    ok: false },
        ],
        cf: 'Isso! Quanto mais especializado e difícil de substituir, mais valor você cria.',
        wf: 'Pensa no quanto o cliente economizaria sem você — esse é o valor real.',
      },
    ],
  },

  'm1-oportunidade2': {
    title: 'Encontrando uma oportunidade #2',
    exercises: [
      {
        type: 'mc',
        q: 'Seu amigo está com fome no recreio e esqueceu o lanche. O que isso representa?',
        opts: [
          { e: '😢', t: 'Um problema só do seu amigo',         ok: false },
          { e: '🎯', t: 'Uma oportunidade de negócio',         ok: true  },
          { e: '🙈', t: 'Nada, cada um que se vire',           ok: false },
          { e: '📞', t: 'Ligar pra mãe dele resolver',         ok: false },
        ],
        cf: 'Isso! Todo problema é uma oportunidade disfarçada.',
        wf: 'Empreendedores veem problemas como oportunidades.',
      },
      {
        type: 'mc',
        q: 'Você percebe que todo mundo na sua rua tem cachorro mas não tem petshop perto. O que isso significa?',
        opts: [
          { e: '🐕', t: 'As pessoas adoram cachorro',           ok: false },
          { e: '🏪', t: 'Tem espaço pra um petshop aqui',      ok: true  },
          { e: '🚗', t: 'As pessoas precisam ir longe',         ok: false },
          { e: '😴', t: 'Não significa nada',                  ok: false },
        ],
        cf: 'Exato! Demanda existente + oferta inexistente = oportunidade clara.',
        wf: 'Pensa: tem muita gente precisando de algo que não existe perto.',
      },
      {
        type: 'mc',
        q: 'Qual destes problemas você conseguiria resolver com R$0?',
        opts: [
          { e: '✏️', t: 'Ensinar colegas em matérias que você é bom',    ok: true  },
          { e: '🏭', t: 'Abrir uma fábrica de roupas',                    ok: false },
          { e: '🚀', t: 'Criar um app de celular do zero',                ok: false },
          { e: '🏠', t: 'Construir casas para pessoas',                   ok: false },
        ],
        cf: 'Isso! Você já tem o ativo mais valioso: conhecimento e disposição.',
        wf: 'Tenta de novo — qual destes não precisa de dinheiro pra começar?',
      },
      {
        type: 'mc',
        q: 'Empreendedorismo é sobre:',
        opts: [
          { e: '💰', t: 'Ficar rico rápido',                              ok: false },
          { e: '🎯', t: 'Resolver um problema de alguém e ser pago por isso', ok: true },
          { e: '🏆', t: 'Ganhar de todo mundo',                           ok: false },
          { e: '😎', t: 'Ser famoso',                                     ok: false },
        ],
        cf: 'Perfeito! Essa definição vai ficar com você pra sempre.',
        wf: 'A essência do empreendedorismo é resolver problemas. O dinheiro é consequência.',
      },
    ],
  },

  'm1-ideia': {
    title: 'Sua primeira ideia',
    exercises: [
      {
        type: 'mc',
        q: 'Uma boa ideia de negócio precisa de:',
        opts: [
          { e: '💡', t: 'Ser 100% original e nunca ter sido feita',       ok: false },
          { e: '🎯', t: 'Resolver um problema real de alguém',             ok: true  },
          { e: '💻', t: 'Muita tecnologia e investimento',                 ok: false },
          { e: '📊', t: 'Um plano de negócios de 50 páginas',             ok: false },
        ],
        cf: 'Isso! A maioria dos grandes negócios resolve um problema simples de forma melhor.',
        wf: 'Pensa nos negócios que você usa todo dia — todos resolvem um problema.',
      },
      {
        type: 'mc',
        q: 'Pedro quer começar um negócio mas não sabe por onde. Qual é o melhor primeiro passo?',
        opts: [
          { e: '📱', t: 'Criar um Instagram pra marca',                   ok: false },
          { e: '👀', t: 'Observar problemas ao redor por uma semana',     ok: true  },
          { e: '💸', t: 'Juntar dinheiro pra investir',                   ok: false },
          { e: '📋', t: 'Fazer uma lista de tudo que é difícil fazer',    ok: false },
        ],
        cf: 'Perfeito! Observação é o superpoder do empreendedor.',
        wf: 'O ponto de partida certo é sempre o problema — não o produto.',
      },
      {
        type: 'mc',
        q: 'Qual destas é a melhor ideia de negócio para um jovem de 12 anos?',
        opts: [
          { e: '✂️', t: 'Cortar cabelo de vizinhos por R$10',            ok: true  },
          { e: '🏦', t: 'Abrir um banco digital',                         ok: false },
          { e: '✈️', t: 'Criar uma companhia aérea',                      ok: false },
          { e: '🏗️', t: 'Construir prédios no bairro',                   ok: false },
        ],
        cf: 'Isso! Começo simples, habilidade acessível, cliente na porta de casa.',
        wf: 'A melhor ideia é aquela que você consegue testar hoje, com o que tem.',
      },
      {
        type: 'composite',
        q: 'Agora é a sua vez. Crie sua primeira ideia:',
        steps: [
          { q: 'Que habilidade você tem?',           opts: ['✏️ Desenho/Arte', '📚 Estudos', '🎮 Tecnologia'] },
          { q: 'Quem precisa dessa habilidade?',     opts: ['👧 Crianças menores', '👴 Adultos', '🏫 Minha escola'] },
          { q: 'Quanto você poderia cobrar por hora?', opts: ['R$10', 'R$20', 'R$30'] },
        ],
        cf: 'Você acabou de criar sua primeira ideia de negócio. Isso é empreendedorismo!',
      },
    ],
  },

  // ── MÓDULO 2 ─────────────────────────────────────────────────────────────────
  'm2-nome': {
    title: 'Nome do negócio',
    exercises: [
      {
        type: 'mc',
        q: 'O nome do seu negócio deve ser:',
        opts: [
          { e: '🧩', t: 'Complicado pra parecer sério',                      ok: false },
          { e: '🎯', t: 'Fácil de lembrar e dizer em voz alta',              ok: true  },
          { e: '📚', t: 'Uma palavra do dicionário em inglês',                ok: false },
          { e: '🔢', t: 'Seu nome completo + números aleatórios',            ok: false },
        ],
        cf: 'Isso! Um nome que gruda na cabeça vale mais do que um que parece sofisticado.',
        wf: 'O melhor nome é aquele que seu cliente consegue repetir sem errar.',
      },
      {
        type: 'mc',
        q: 'Qual destes é um bom nome para um negócio de doces artesanais?',
        opts: [
          { e: '🍬', t: 'ConfeitariaArteDocesMKT_2024',                      ok: false },
          { e: '✨', t: 'Doce do João',                                        ok: true  },
          { e: '🌍', t: 'Global Sweet International Inc.',                    ok: false },
          { e: '🤷', t: 'Empresa 1',                                          ok: false },
        ],
        cf: 'Perfeito! Simples, humano e fácil de indicar pra alguém.',
        wf: 'Menos é mais. Nomes simples são mais fáceis de recomendar.',
      },
      {
        type: 'mc',
        q: 'Antes de decidir um nome, o que você deve verificar?',
        opts: [
          { e: '🎲', t: 'Se parece bonito no papel',                         ok: false },
          { e: '🔍', t: 'Se já não existe outro negócio com o mesmo nome',    ok: true  },
          { e: '📖', t: 'Se está no dicionário',                              ok: false },
          { e: '💰', t: 'Se o nome vai garantir lucro',                       ok: false },
        ],
        cf: 'Exato! Checar disponibilidade evita problemas legais e de confusão de marca.',
        wf: 'Um nome já usado cria confusão. Sempre pesquise antes de decidir.',
      },
      {
        type: 'composite',
        q: 'Agora crie o nome do seu negócio:',
        steps: [
          { q: 'Que tipo de negócio é?',             opts: ['🛒 Produto físico', '⚡ Serviço', '📱 Digital'] },
          { q: 'Que sentimento o nome deve passar?',  opts: ['🏡 Aconchego e confiança', '🚀 Inovação e velocidade', '😄 Diversão e leveza'] },
          { q: 'Qual estilo de nome combina mais?',   opts: ['👤 Meu nome + produto ("Bolo da Ana")', '🎯 O que faz ("Conserta Rápido")', '💡 Palavra inventada ("Zapfy")'] },
        ],
        cf: 'Você definiu a identidade sonora do seu negócio. Isso é branding!',
      },
    ],
  },

  'm2-identidade': {
    title: 'Identidade da marca',
    exercises: [
      {
        type: 'mc',
        q: 'O que é a identidade de uma marca?',
        opts: [
          { e: '🖼️', t: 'Só o logo e as cores',                               ok: false },
          { e: '🎯', t: 'Como o negócio se apresenta: visual, tom, valores',   ok: true  },
          { e: '📱', t: 'O perfil nas redes sociais',                          ok: false },
          { e: '💸', t: 'O preço que você cobra',                              ok: false },
        ],
        cf: 'Isso! Identidade é tudo que faz seu negócio ser reconhecível e diferente.',
        wf: 'Logo é apenas uma parte. Identidade inclui tom de voz, valores e sensação.',
      },
      {
        type: 'mc',
        q: 'Por que uma marca precisa de cores escolhidas com intenção?',
        opts: [
          { e: '😍', t: 'Só pra ficar bonito',                                 ok: false },
          { e: '🧠', t: 'Cores transmitem emoções e ajudam a ser lembrado',    ok: true  },
          { e: '🎨', t: 'Pra combinar com a roupa do dono',                    ok: false },
          { e: '💸', t: 'Cores mais caras vendem mais',                        ok: false },
        ],
        cf: 'Exato! Azul passa confiança, verde passa saúde, laranja passa energia. Cada cor comunica.',
        wf: 'Cores criam associações inconscientes. Zapfy é azul pra passar confiança e crescimento.',
      },
      {
        type: 'mc',
        q: 'Qual é o tom de voz certo para um negócio de tutoria para crianças?',
        opts: [
          { e: '😎', t: 'Formal e técnico, pra parecer autoridade',            ok: false },
          { e: '😄', t: 'Amigável e encorajador, como um professor legal',     ok: true  },
          { e: '🤑', t: 'Focado em promoções e descontos',                    ok: false },
          { e: '😤', t: 'Sério e distante pra ser respeitado',                ok: false },
        ],
        cf: 'Perfeito! Tom de voz deve refletir quem é seu cliente e o que ele sente.',
        wf: 'Tom de voz errado afasta clientes. Fale do jeito que seu cliente gosta de ouvir.',
      },
      {
        type: 'mc',
        q: 'Você quer que as pessoas sintam ___ ao ver seu negócio:',
        opts: [
          { e: '🤝', t: '"Esse eu confio e quero recomendar"',                 ok: true  },
          { e: '😕', t: '"Que negócio estranho"',                              ok: false },
          { e: '🙈', t: '"Nunca ouvi falar"',                                  ok: false },
          { e: '😴', t: '"Mais um igual a todos"',                             ok: false },
        ],
        cf: 'Isso! Confiança + recomendação é o objetivo central de toda boa identidade de marca.',
        wf: 'Identidade boa faz as pessoas quererem indicar seu negócio para os amigos.',
      },
    ],
  },

  'm2-diferencial': {
    title: 'Seu diferencial',
    exercises: [
      {
        type: 'mc',
        q: 'O que é o diferencial de um negócio?',
        opts: [
          { e: '💸', t: 'Ser mais barato que todo mundo',                     ok: false },
          { e: '🎯', t: 'O que faz você ser a melhor opção para o seu cliente', ok: true },
          { e: '📱', t: 'Ter mais seguidores que a concorrência',             ok: false },
          { e: '🏆', t: 'Ganhar prêmios e reconhecimentos',                  ok: false },
        ],
        cf: 'Exato! Diferencial não é ser perfeito pra todos — é ser perfeito pro seu cliente específico.',
        wf: 'Ser barato não é diferencial — é corrida pro fundo. Diferencial é valor único.',
      },
      {
        type: 'mc',
        q: 'Dois negócios de brigadeiro. Um usa chocolate belga e entrega em caixas premium. Qual é o diferencial?',
        opts: [
          { e: '🍫', t: 'O chocolate é mais gostoso',                         ok: false },
          { e: '💎', t: 'A experiência completa de presente especial',         ok: true  },
          { e: '💸', t: 'O preço mais alto',                                   ok: false },
          { e: '📦', t: 'A caixa bonita',                                      ok: false },
        ],
        cf: 'Isso! O diferencial é a experiência inteira, não só o ingrediente.',
        wf: 'Diferencial é o conjunto. Chocolate + caixa + entrega = experiência de presente.',
      },
      {
        type: 'mc',
        q: 'Qual pergunta melhor ajuda a descobrir seu diferencial?',
        opts: [
          { e: '💰', t: '"Por que eu deveria cobrar mais do que os outros?"', ok: false },
          { e: '🎯', t: '"Por que um cliente específico me escolheria em vez da alternativa?"', ok: true },
          { e: '📢', t: '"Como eu faço mais barulho do que a concorrência?"', ok: false },
          { e: '🤔', t: '"O que eu gosto de fazer?"',                         ok: false },
        ],
        cf: 'Perfeito! A resposta a essa pergunta É o seu diferencial.',
        wf: 'O diferencial existe sempre na comparação com algo. Sempre pense "em vez de quê?"',
      },
      {
        type: 'composite',
        q: 'Defina o diferencial do seu negócio:',
        steps: [
          { q: 'Quem é seu concorrente direto?',         opts: ['🏪 Loja estabelecida', '👤 Outro jovem empreendedor', '🤷 Ninguém ainda faz isso'] },
          { q: 'O que você faz diferente?',              opts: ['⚡ Mais rápido e prático', '❤️ Atendimento mais pessoal', '💡 Solução que eles não têm'] },
          { q: 'Qual cliente mais se beneficia disso?',  opts: ['👧 Crianças/adolescentes', '👨‍👩‍👧 Pais e famílias', '🏫 Escola/professores'] },
        ],
        cf: 'Você tem um posicionamento. Esse é o coração da estratégia do seu negócio.',
      },
    ],
  },

  // ── MÓDULO 3 ─────────────────────────────────────────────────────────────────
  'm3-cliente': {
    title: 'Quem compraria de você',
    company: true,
    exercises: [
      {
        type: 'mc',
        q: 'Quem compraria {product} da sua empresa {companyName}?',
        opts: [
          { e: '👤', t: 'Todo mundo, qualquer pessoa',                    ok: false },
          { e: '🎯', t: 'Pessoas que têm o problema que você resolve',    ok: true  },
          { e: '💰', t: 'Só quem tem muito dinheiro',                     ok: false },
          { e: '🌍', t: 'O mundo inteiro',                                ok: false },
        ],
        cf: 'Exato! Quanto mais específico seu cliente, mais fácil é vender pra ele.',
        wf: 'Tentar vender pra todo mundo é vender pra ninguém.',
      },
      {
        type: 'mc',
        q: 'Você quer saber quem é seu cliente ideal. O que você faz?',
        opts: [
          { e: '🤔', t: 'Imagina na sua cabeça quem seria',               ok: false },
          { e: '💬', t: 'Conversa com pessoas reais e faz perguntas',     ok: true  },
          { e: '📊', t: 'Pesquisa em artigos da internet',                ok: false },
          { e: '⏳', t: 'Espera os clientes aparecerem sozinhos',         ok: false },
        ],
        cf: 'Perfeito! Conversas reais valem mais do que qualquer pesquisa de internet.',
        wf: 'Dados reais vêm de conversas reais — não de suposições.',
      },
      {
        type: 'mc',
        q: 'Seu primeiro cliente provavelmente está:',
        opts: [
          { e: '🌐', t: 'Na internet, em algum lugar do Brasil',          ok: false },
          { e: '🏘️', t: 'No seu círculo próximo: família, amigos, escola', ok: true },
          { e: '🏙️', t: 'Em outra cidade maior',                         ok: false },
          { e: '✈️', t: 'Fora do país',                                   ok: false },
        ],
        cf: 'Isso! Os primeiros clientes quase sempre são pessoas que já te conhecem.',
        wf: 'Começa perto. Seus primeiros 5 clientes são mais fáceis de encontrar do que imagina.',
      },
      {
        type: 'mc',
        q: 'Como você descobre o que seu cliente realmente quer?',
        opts: [
          { e: '💭', t: 'Adivinhar o que ele provavelmente quer',         ok: false },
          { e: '❓', t: 'Perguntar diretamente pra ele',                  ok: true  },
          { e: '📺', t: 'Assistir comerciais do setor',                   ok: false },
          { e: '📖', t: 'Ler livros de marketing',                        ok: false },
        ],
        cf: 'A resposta mais óbvia é a certa: pergunte. Clientes adoram quando alguém se importa.',
        wf: 'Nunca assuma — sempre pergunte. O cliente sabe mais sobre o problema dele do que você.',
      },
    ],
  },

  'm3-motivo': {
    title: 'Por que pagar por isso',
    company: true,
    exercises: [
      {
        type: 'mc',
        q: 'Por que alguém pagaria por {product} em vez de fazer sozinho?',
        opts: [
          { e: '⏰', t: 'Porque economiza tempo',                         ok: true  },
          { e: '💸', t: 'Porque tem dinheiro sobrando',                   ok: false },
          { e: '😴', t: 'Porque é preguiçoso',                            ok: false },
          { e: '🎲', t: 'Por acaso',                                      ok: false },
        ],
        cf: 'Isso! Tempo, conveniência e resultado melhor são as razões principais.',
        wf: 'Pensa: por que você paga alguém pra fazer algo que teoricamente poderia fazer?',
      },
      {
        type: 'mc',
        q: 'Qual destas razões faz um cliente querer pagar mais?',
        opts: [
          { e: '⚡', t: 'Resultado rápido e garantido',                   ok: true  },
          { e: '💬', t: 'Muita conversa sobre o produto',                 ok: false },
          { e: '📄', t: 'Papel bonito na embalagem',                      ok: false },
          { e: '🔴', t: 'Cor chamativa',                                  ok: false },
        ],
        cf: 'Perfeito! Velocidade + certeza de resultado = disposição a pagar mais.',
        wf: 'O cliente paga por resultado, não por esforço ou apresentação.',
      },
      {
        type: 'mc',
        q: 'Sofia cobra R$5 por brigadeiro. A Cacau Show cobra R$12. Por que alguém pagaria mais?',
        opts: [
          { e: '🍫', t: 'Porque o da Cacau Show é mais gostoso',         ok: false },
          { e: '🏷️', t: 'Porque é uma marca conhecida que transmite confiança', ok: true },
          { e: '💰', t: 'Porque as pessoas têm dinheiro sobrando',        ok: false },
          { e: '😱', t: 'Não faz sentido pagar mais',                     ok: false },
        ],
        cf: 'Isso! Marca = confiança = disposição a pagar mais. Sofia pode construir isso também.',
        wf: 'Pense: por que você pagaria mais por uma marca que conhece?',
      },
      {
        type: 'mc',
        q: 'Seu cliente potencial disse "é caro". O que isso significa?',
        opts: [
          { e: '💔', t: 'Ele nunca vai comprar',                          ok: false },
          { e: '💡', t: 'Ele ainda não vê valor suficiente no que você oferece', ok: true },
          { e: '📉', t: 'Você deve baixar o preço imediatamente',         ok: false },
          { e: '🚪', t: 'Desistir e procurar outro cliente',              ok: false },
        ],
        cf: 'Exato! "Caro" quase sempre significa "não entendi o valor". Explique melhor.',
        wf: '"Caro" é uma objeção, não uma sentença. Aprenda a responder a ela.',
      },
    ],
  },

  'm3-canais': {
    title: 'Onde encontrar seu cliente',
    company: true,
    exercises: [
      {
        type: 'mc',
        q: 'Onde seu cliente ideal provavelmente passa mais tempo?',
        opts: [
          { e: '📱', t: 'Instagram e TikTok',                             ok: false },
          { e: '🏫', t: 'Depende — você precisa descobrir pra cada tipo de cliente', ok: true },
          { e: '🏪', t: 'Em lojas físicas',                               ok: false },
          { e: '📧', t: 'No e-mail',                                      ok: false },
        ],
        cf: 'Isso! Não existe canal universal — cada cliente tem o seu.',
        wf: 'O canal certo depende de QUEM é o seu cliente. Sempre comece por aí.',
      },
      {
        type: 'mc',
        q: 'Você quer vender {product}. Qual canal faz mais sentido para o seu primeiro cliente?',
        opts: [
          { e: '🤝', t: 'Indicação de alguém que você já conhece',        ok: true  },
          { e: '📺', t: 'Anúncio na TV',                                  ok: false },
          { e: '✈️', t: 'Panfleto jogado da janela',                      ok: false },
          { e: '🌐', t: 'Site profissional com SEO',                      ok: false },
        ],
        cf: 'Perfeito! Indicação é o canal mais poderoso para quem está começando.',
        wf: 'Para os primeiros clientes, indicação e conversa direta batem qualquer canal pago.',
      },
      {
        type: 'mc',
        q: 'Como você abordaria um cliente que nunca ouviu falar de você?',
        opts: [
          { e: '📢', t: 'Gritando "compre meu produto" na rua',           ok: false },
          { e: '💬', t: 'Perguntando sobre o problema dele antes de falar do produto', ok: true },
          { e: '📧', t: 'Mandando e-mail frio longo',                     ok: false },
          { e: '🎁', t: 'Dando o produto de graça primeiro',              ok: false },
        ],
        cf: 'Isso! Entender o problema antes de vender é a diferença entre venda e chateação.',
        wf: 'Ninguém quer que vendam pra eles — as pessoas querem quem entenda seus problemas.',
      },
      {
        type: 'mc',
        q: 'Você tem 3 potenciais clientes em mente. Qual você abordaria primeiro?',
        opts: [
          { e: '🌟', t: 'O mais famoso e influente',                      ok: false },
          { e: '🤝', t: 'O que você já tem relacionamento',               ok: true  },
          { e: '💰', t: 'O que parece ter mais dinheiro',                 ok: false },
          { e: '🎲', t: 'Qualquer um, tanto faz',                         ok: false },
        ],
        cf: 'Certo! Relacionamento existente = caminho mais rápido para a primeira venda.',
        wf: 'Sempre começa por onde a confiança já existe.',
      },
    ],
  },

  'm3-abordagem': {
    title: 'Como chegar até ele',
    company: true,
    exercises: [
      {
        type: 'mc',
        q: 'Qual é o melhor jeito de apresentar {companyName} para alguém pela primeira vez?',
        opts: [
          { e: '📖', t: 'Ler um script que você decorou',                 ok: false },
          { e: '🗣️', t: 'Contar uma história curta de como surgiu a ideia', ok: true },
          { e: '📊', t: 'Mostrar uma planilha com números',               ok: false },
          { e: '📝', t: 'Entregar um folder completo',                    ok: false },
        ],
        cf: 'Isso! Histórias criam conexão. Dados e folders criam distância.',
        wf: 'Pessoas se conectam com histórias, não com apresentações formais.',
      },
      {
        type: 'mc',
        q: 'Você tem 30 segundos para falar de {companyName}. O que você diz?',
        opts: [
          { e: '📋', t: 'Lista todos os produtos e serviços que oferece', ok: false },
          { e: '🎯', t: 'Fala o problema que resolve e pra quem',         ok: true  },
          { e: '💰', t: 'Fala o preço logo de cara',                      ok: false },
          { e: '🔢', t: 'Começa pelos dados e estatísticas',              ok: false },
        ],
        cf: 'Perfeito! Problema + público = pitch de 30 segundos perfeito.',
        wf: 'Em 30 segundos, só tem espaço para o mais importante: problema e quem você ajuda.',
      },
      {
        type: 'mc',
        q: 'O cliente disse "vou pensar". O que você faz?',
        opts: [
          { e: '⏳', t: 'Espera indefinidamente ele voltar',              ok: false },
          { e: '📅', t: 'Combina um dia específico pra dar uma resposta', ok: true  },
          { e: '😡', t: 'Insiste até ele comprar',                        ok: false },
          { e: '🚪', t: 'Desiste e vai embora',                           ok: false },
        ],
        cf: 'Isso! "Vou pensar" sem prazo = nunca. Sempre marque o próximo passo.',
        wf: 'Sem prazo combinado, "vou pensar" vira "esqueci". Defina o próximo passo.',
      },
      {
        type: 'mc',
        q: 'Depois da primeira conversa com um cliente em potencial, o que você faz?',
        opts: [
          { e: '😴', t: 'Espera ele entrar em contato',                   ok: false },
          { e: '✉️', t: 'Manda um resumo do que conversaram + próximo passo', ok: true },
          { e: '📱', t: 'Posta no story dizendo que quase fechou',        ok: false },
          { e: '🎉', t: 'Comemora como se já tivesse vendido',            ok: false },
        ],
        cf: 'Perfeito! Follow-up rápido mostra profissionalismo e mantém você na memória do cliente.',
        wf: 'O follow-up é onde a maioria desiste — e onde você pode se destacar.',
      },
    ],
  },

  // ── MÓDULO 4 ─────────────────────────────────────────────────────────────────
  'm4-custo': {
    title: 'Custo vs. valor',
    company: true,
    exercises: [
      {
        type: 'mc',
        q: 'Qual é a diferença entre custo e valor?',
        opts: [
          { e: '💸', t: 'São a mesma coisa',                              ok: false },
          { e: '🎯', t: 'Custo é o que você gasta; valor é o que o cliente percebe', ok: true },
          { e: '📊', t: 'Custo é sempre maior que o valor',               ok: false },
          { e: '🔢', t: 'Valor é calculado somando os custos',            ok: false },
        ],
        cf: 'Exato! Custo olha pra dentro (você). Valor olha pra fora (o cliente).',
        wf: 'Custo e valor são perspectivas diferentes do mesmo produto.',
      },
      {
        type: 'mc',
        q: 'Para {product} da {companyName}, o que importa mais para o preço?',
        opts: [
          { e: '💰', t: 'Só o quanto custou pra fazer',                   ok: false },
          { e: '🎯', t: 'O quanto o cliente está disposto a pagar pelo resultado', ok: true },
          { e: '📊', t: 'O preço do concorrente dividido por 2',          ok: false },
          { e: '🎲', t: 'Um número que você acha justo',                  ok: false },
        ],
        cf: 'Isso! Preço baseado em valor captura mais do que preço baseado em custo.',
        wf: 'Preço não é sobre custo — é sobre quanto o resultado vale pro cliente.',
      },
      {
        type: 'mc',
        q: 'Sua {companyName} gasta R$20 pra fazer algo. Quanto você pode cobrar?',
        opts: [
          { e: '💸', t: 'R$22 (10% de margem)',                           ok: false },
          { e: '🎯', t: 'Qualquer valor que o cliente aceite e justifique', ok: true },
          { e: '⚖️', t: 'Exatamente R$40 (dobro do custo)',               ok: false },
          { e: '🔢', t: 'R$20 pra ser honesto',                           ok: false },
        ],
        cf: 'Perfeito! Se o cliente paga R$100 porque vale pra ele, você pode cobrar R$100.',
        wf: 'Não existe regra que diz "margem certa". Existe o valor percebido pelo cliente.',
      },
      {
        type: 'mc',
        q: 'Como você aumenta o valor percebido de {product}?',
        opts: [
          { e: '📉', t: 'Baixando o preço',                               ok: false },
          { e: '✨', t: 'Melhorando o resultado e contando histórias de quem já usou', ok: true },
          { e: '📢', t: 'Fazendo mais barulho nas redes sociais',         ok: false },
          { e: '🏷️', t: 'Colocando uma embalagem mais cara',             ok: false },
        ],
        cf: 'Isso! Resultado concreto + prova social = valor percebido mais alto.',
        wf: 'Valor percebido cresce com resultados reais e provas de quem já usou.',
      },
    ],
  },

  'm4-preco': {
    title: 'Como precificar',
    company: true,
    exercises: [
      {
        type: 'mc',
        q: 'Você vai precificar {product}. Por onde começa?',
        opts: [
          { e: '🔢', t: 'Calcula o custo e multiplica por 2',             ok: false },
          { e: '🎯', t: 'Pergunta quanto o cliente pagaria antes de definir', ok: true },
          { e: '📊', t: 'Copia o preço do concorrente mais próximo',      ok: false },
          { e: '🎲', t: 'Chuta um número redondo',                        ok: false },
        ],
        cf: 'Perfeito! Perguntar antes de precificar evita deixar dinheiro na mesa ou espantar clientes.',
        wf: 'Sempre descubra o teto de preço do cliente antes de definir o seu.',
      },
      {
        type: 'mc',
        q: 'Seu concorrente cobra R$50. Você deve:',
        opts: [
          { e: '📉', t: 'Cobrar R$45 pra ser mais barato',                ok: false },
          { e: '📈', t: 'Cobrar R$70 se tiver diferencial claro',         ok: true  },
          { e: '⚖️', t: 'Cobrar exatamente R$50',                         ok: false },
          { e: '🆓', t: 'Dar de graça pra conquistar mercado',            ok: false },
        ],
        cf: 'Isso! Se você é melhor, cobra mais. Preço baixo sem diferencial é corrida pro fundo.',
        wf: 'Competir por preço é perigoso — sempre tem alguém disposto a cobrar menos.',
      },
      {
        type: 'mc',
        q: 'Quando você pode aumentar seu preço?',
        opts: [
          { e: '📅', t: 'No aniversário da empresa',                      ok: false },
          { e: '🎯', t: 'Quando você tem mais resultados provados e depoimentos', ok: true },
          { e: '💸', t: 'Quando precisar de mais dinheiro',               ok: false },
          { e: '🎲', t: 'Qualquer hora, sem motivo',                      ok: false },
        ],
        cf: 'Exato! Cada resultado novo e depoimento real justifica um preço mais alto.',
        wf: 'Preço sobe com prova de valor — não com necessidade.',
      },
      {
        type: 'mc',
        q: 'O cliente diz "tá bom, mas pode dar um desconto?" O que você faz?',
        opts: [
          { e: '🎁', t: 'Dá desconto imediatamente pra fechar logo',      ok: false },
          { e: '💡', t: 'Negocia algo em troca: depoimento, indicação, prazo', ok: true },
          { e: '😤', t: 'Recusa e vai embora ofendido',                   ok: false },
          { e: '⏳', t: 'Diz que vai pensar',                             ok: false },
        ],
        cf: 'Perfeito! Se der desconto, peça algo em troca. Desconto sem contrapartida desvaloriza.',
        wf: 'Desconto pode ser ok — mas sempre troque por algo: depoimento, indicação, visibilidade.',
      },
    ],
  },

  'm4-negociacao': {
    title: 'Simulação de negociação',
    company: true,
    exercises: [
      {
        type: 'mc',
        q: 'Um cliente quer comprar {product} mas diz que o preço está alto. Sua resposta:',
        opts: [
          { e: '😰', t: '"Pode ser... quanto você quer pagar?"',           ok: false },
          { e: '💡', t: '"Entendo. O que você recebe de resultado vale o preço — posso explicar?"', ok: true },
          { e: '😡', t: '"Não faço desconto de jeito nenhum."',           ok: false },
          { e: '🚪', t: '"Ok, tchau então."',                             ok: false },
        ],
        cf: 'Isso! Volte sempre pro valor, não pro preço.',
        wf: 'Quando alguém diz "caro", significa que ainda não viu o valor. Mostre o valor.',
      },
      {
        type: 'mc',
        q: 'Na negociação, quem deve fazer a primeira oferta?',
        opts: [
          { e: '🤐', t: 'Nunca você — espera o cliente falar primeiro',   ok: false },
          { e: '🎯', t: 'Você, com um preço um pouco acima do mínimo aceitável', ok: true },
          { e: '⚖️', t: 'Os dois ao mesmo tempo',                          ok: false },
          { e: '🎲', t: 'Não importa quem faz primeiro',                  ok: false },
        ],
        cf: 'Perfeito! Quem ancora o número primeiro define o terreno da negociação.',
        wf: 'Fazer a primeira oferta te coloca no controle. Comece um pouco acima do que quer.',
      },
      {
        type: 'mc',
        q: 'O cliente quer {product} mas pede pra pagar em 3x. Você:',
        opts: [
          { e: '❌', t: 'Recusa — só aceita à vista',                    ok: false },
          { e: '✅', t: 'Aceita se o total final compensar o esforço',    ok: true  },
          { e: '🆓', t: 'Dá de graça pra ganhar a confiança dele',       ok: false },
          { e: '😤', t: 'Fica ofendido com a proposta',                  ok: false },
        ],
        cf: 'Isso! Flexibilidade de pagamento pode fechar negócios que dinheiro não fecha.',
        wf: 'Formas de pagamento são parte da negociação — seja flexível se o total fizer sentido.',
      },
      {
        type: 'mc',
        q: 'Depois de combinado o preço, o que você faz?',
        opts: [
          { e: '🤝', t: 'Aperta a mão e confia na memória',              ok: false },
          { e: '📝', t: 'Coloca por escrito: o que será feito, quando e por quanto', ok: true },
          { e: '📱', t: 'Posta nas redes sociais comemorando',            ok: false },
          { e: '💤', t: 'Espera o cliente formalizar',                    ok: false },
        ],
        cf: 'Perfeito! Acordo não escrito é acordo a ser disputado. Sempre documente.',
        wf: 'Combinado por escrito evita mal-entendido e mostra profissionalismo.',
      },
    ],
  },

  'm4-entrega': {
    title: 'Entregar com responsabilidade',
    company: true,
    exercises: [
      {
        type: 'mc',
        q: 'O que significa entregar {product} com responsabilidade?',
        opts: [
          { e: '⏰', t: 'Entregar no prazo combinado, mesmo que não seja o ideal', ok: false },
          { e: '🎯', t: 'Entregar o que foi prometido, no prazo, com qualidade',   ok: true  },
          { e: '📦', t: 'Colocar numa embalagem bonita',                  ok: false },
          { e: '💬', t: 'Mandar muitas mensagens avisando que está fazendo', ok: false },
        ],
        cf: 'Exato! As três pernas da responsabilidade: o que, quando e como.',
        wf: 'Responsabilidade na entrega é: o que prometeu + quando prometeu + como prometeu.',
      },
      {
        type: 'mc',
        q: 'Você vai atrasar a entrega de {product}. O que faz?',
        opts: [
          { e: '🤐', t: 'Não fala nada e entrega quando puder',           ok: false },
          { e: '📱', t: 'Avisa o cliente com antecedência e oferece solução', ok: true },
          { e: '🙏', t: 'Espera o cliente reclamar pra se desculpar',    ok: false },
          { e: '🚀', t: 'Entrega qualquer coisa pra não atrasar',         ok: false },
        ],
        cf: 'Isso! Transparência + solução proativa = cliente que perdoa e volta.',
        wf: 'Avisar antes é sinal de respeito. O cliente pode lidar com atraso, não com surpresa.',
      },
      {
        type: 'mc',
        q: 'O cliente não ficou 100% satisfeito com {product}. O que você faz?',
        opts: [
          { e: '😤', t: 'Defende seu trabalho e explica por que está certo', ok: false },
          { e: '🎯', t: 'Escuta, entende o que faltou e propõe uma solução', ok: true  },
          { e: '💸', t: 'Devolve o dinheiro imediatamente sem discutir',   ok: false },
          { e: '👻', t: 'Some e para de responder',                        ok: false },
        ],
        cf: 'Perfeito! Cliente insatisfeito tratado bem vira seu melhor case de sucesso.',
        wf: 'Insatisfação tratada bem gera mais confiança do que entrega perfeita.',
      },
      {
        type: 'mc',
        q: 'Depois de entregar {product} e o cliente ficar satisfeito, o que você faz?',
        opts: [
          { e: '😴', t: 'Descansa — missão cumprida',                     ok: false },
          { e: '🎯', t: 'Pede um depoimento e pergunta se conhece alguém que precisaria', ok: true },
          { e: '📈', t: 'Aumenta o preço na hora',                        ok: false },
          { e: '📱', t: 'Posta no Instagram pra ganhar seguidores',        ok: false },
        ],
        cf: 'Isso! Cliente satisfeito é sua melhor ferramenta de vendas. Use ela.',
        wf: 'O ciclo virtuoso é: entrega boa → depoimento → indicação → próximo cliente.',
      },
    ],
  },

  // ── MÓDULO 5 ─────────────────────────────────────────────────────────────────
  'm5-prep': {
    title: 'Preparando a venda',
    company: true,
    exercises: [
      {
        type: 'mc',
        q: 'Antes de tentar vender {product}, o que você precisa ter preparado?',
        opts: [
          { e: '📋', t: 'Um catálogo completo de tudo que você oferece',  ok: false },
          { e: '🎯', t: 'Nome do cliente, problema dele e sua solução em 3 frases', ok: true },
          { e: '📊', t: 'Uma apresentação de 20 slides',                  ok: false },
          { e: '💸', t: 'Descontos pra oferecer se ele recusar',          ok: false },
        ],
        cf: 'Exato! Menos é mais. Entenda o cliente antes de montar seu pitch.',
        wf: 'Preparação não é quantidade de material — é profundidade sobre o cliente.',
      },
      {
        type: 'mc',
        q: 'Qual é o melhor sinal de que um cliente está pronto para comprar?',
        opts: [
          { e: '😊', t: 'Ele sorri muito durante a conversa',             ok: false },
          { e: '❓', t: 'Ele começa a fazer perguntas sobre detalhes práticos', ok: true },
          { e: '📱', t: 'Ele tira foto do produto',                       ok: false },
          { e: '💬', t: 'Ele fala muito durante a conversa',              ok: false },
        ],
        cf: 'Perfeito! Perguntas práticas ("quando entrega?", "como pago?") são sinal de compra.',
        wf: 'Perguntas sobre detalhes práticos = cliente pensando em como vai usar. Boa hora pra fechar.',
      },
      {
        type: 'mc',
        q: 'Como você cria urgência para vender {product}?',
        opts: [
          { e: '🤥', t: 'Inventa que tem estoque limitado',               ok: false },
          { e: '🎯', t: 'Mostra o custo real de não resolver o problema agora', ok: true },
          { e: '📢', t: 'Grita que é a última oportunidade',              ok: false },
          { e: '⏱️', t: 'Dá um prazo arbitrário sem explicar',            ok: false },
        ],
        cf: 'Isso! Urgência real vem do custo do problema — não de pressão falsa.',
        wf: 'Urgência manipulada destrói confiança. Urgência real (custo do problema) é legítima.',
      },
      {
        type: 'mc',
        q: 'Você vai fazer sua primeira venda de {product}. Qual é sua meta para essa conversa?',
        opts: [
          { e: '💰', t: 'Fechar a qualquer custo',                        ok: false },
          { e: '🎯', t: 'Entender o problema e apresentar a solução claramente', ok: true },
          { e: '😎', t: 'Impressionar com seu conhecimento',               ok: false },
          { e: '📊', t: 'Mostrar todos os dados do seu negócio',          ok: false },
        ],
        cf: 'Perfeito! A meta da primeira conversa não é fechar — é entender e conectar.',
        wf: 'Foco em fechar antes de entender espanta clientes. Foque em entender primeiro.',
      },
    ],
  },

  'm5-simulacao': {
    title: 'Simulação completa de venda',
    company: true,
    exercises: [
      {
        type: 'mc',
        q: 'Cliente: "Olá, vi que você oferece {product}. Me conta mais." Sua resposta:',
        opts: [
          { e: '📖', t: 'Lista tudo que o produto faz',                   ok: false },
          { e: '🎯', t: '"Claro! Antes, me conta: qual é o principal desafio que você tem hoje com isso?"', ok: true },
          { e: '💰', t: 'Fala o preço logo',                              ok: false },
          { e: '📊', t: 'Mostra todos os depoimentos que tem',            ok: false },
        ],
        cf: 'Isso! Pergunta antes de apresentar. Entenda o problema antes da solução.',
        wf: 'A primeira resposta deve ser uma pergunta — não uma apresentação.',
      },
      {
        type: 'mc',
        q: 'Cliente: "Entendo, mas quanto custa?" Você ainda não falou de valor. O que faz?',
        opts: [
          { e: '💸', t: 'Fala o preço logo',                              ok: false },
          { e: '🎯', t: 'Explica o resultado primeiro, depois ancora o preço', ok: true },
          { e: '🤐', t: 'Não responde ainda',                             ok: false },
          { e: '📉', t: 'Dá o preço mais baixo possível',                ok: false },
        ],
        cf: 'Perfeito! Resultado + preço é mais eficaz do que só preço.',
        wf: 'Preço sem contexto de valor parece caro. Contexto primeiro, número depois.',
      },
      {
        type: 'mc',
        q: 'Cliente: "Preciso pensar mais um pouco." O que você diz?',
        opts: [
          { e: '✅', t: '"Claro! Posso te mandar um resumo e marcamos uma data pra retornar?"', ok: true },
          { e: '🙏', t: '"Por favor, não vai levar mais de um dia, né?"', ok: false },
          { e: '😤', t: '"O que falta pra fechar agora?"',                ok: false },
          { e: '👋', t: '"Ok, me chama quando quiser."',                  ok: false },
        ],
        cf: 'Exato! Resumo + data = controle do processo sem pressão.',
        wf: 'Sempre combine o próximo passo. "Deixa como está" significa que vai ficar pra sempre.',
      },
      {
        type: 'mc',
        q: 'Cliente: "Ok, vou fechar!" O que vem agora?',
        opts: [
          { e: '🎉', t: 'Comemora muito e manda áudio de 5 minutos de agradecimento', ok: false },
          { e: '🎯', t: 'Confirma o combinado por escrito: o que, quando, quanto e como pagar', ok: true },
          { e: '😴', t: 'Descansa — já fechou',                           ok: false },
          { e: '📱', t: 'Posta story "fechei mais uma venda"',            ok: false },
        ],
        cf: 'Perfeito! Venda fechada = contrato simples. Protege os dois lados.',
        wf: 'Comemorar depois. Primeiro: documento simples com o que foi combinado.',
      },
    ],
  },

  'm5-real': {
    title: 'Desafio: venda real',
    company: true,
    isFounder: true,
    exercises: [
      {
        type: 'mc',
        q: 'Você chegou ao maior desafio do app. Está pronto para tentar uma venda real de {product}?',
        opts: [
          { e: '✅', t: 'Sim, vou tentar com alguém que conheço',         ok: true  },
          { e: '⏳', t: 'Quase — vou estudar mais um pouco antes',        ok: false },
          { e: '😨', t: 'Tenho medo de rejeição',                         ok: false },
          { e: '🤷', t: 'Não sei se vale tentar',                         ok: false },
        ],
        cf: 'Isso! Quem tenta a primeira venda já está à frente de 90% dos empreendedores.',
        wf: 'Todo empreendedor teve medo na primeira venda. E todos que fizeram ficaram felizes depois.',
      },
      {
        type: 'mc',
        q: 'Seu primeiro alvo para a venda real de {product} deve ser:',
        opts: [
          { e: '🌟', t: 'O cliente mais difícil pra testar sua habilidade', ok: false },
          { e: '🤝', t: 'Alguém que já te conhece e confia em você',       ok: true  },
          { e: '🌐', t: 'Alguém que você nunca viu nas redes sociais',     ok: false },
          { e: '💰', t: 'Quem claramente tem mais dinheiro',              ok: false },
        ],
        cf: 'Perfeito! Confiança existente + primeira venda = receita perfeita.',
        wf: 'A primeira venda é sobre aprender, não sobre dinheiro. Onde há confiança, há aprendizado.',
      },
      {
        type: 'mc',
        q: 'Você tentou a venda e o cliente disse não. O que isso significa?',
        opts: [
          { e: '💔', t: 'Que seu produto não presta',                      ok: false },
          { e: '😤', t: 'Que o cliente não entende nada',                  ok: false },
          { e: '🎯', t: 'Que você tem dados novos pra melhorar o pitch',   ok: true  },
          { e: '🚪', t: 'Que você deve desistir de empreender',            ok: false },
        ],
        cf: 'Exato! Todo não é um dado. Pergunte por que e use pra melhorar.',
        wf: 'Não existe fracasso em empreendedorismo — só aprendizado ou resultado.',
      },
      {
        type: 'composite',
        q: 'Registre sua tentativa de venda real:',
        steps: [
          { q: 'Para quem você tentou vender?',   opts: ['👨‍👩‍👧 Familiar', '🤝 Amigo', '👔 Conhecido do bairro'] },
          { q: 'Qual foi o resultado?',            opts: ['✅ Vendeu!', '🔄 Ficou de pensar', '❌ Não quis agora'] },
          { q: 'O que você aprendeu?',             opts: ['💡 Preciso explicar melhor o valor', '🎯 Encontrei o cliente certo', '🔄 Vou tentar com outra pessoa'] },
        ],
        cf: 'Independente do resultado, você fez o que a maioria nunca faz: tentou. Isso é ser Founder.',
      },
    ],
  },
}
