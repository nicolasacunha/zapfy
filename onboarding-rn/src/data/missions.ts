export type MissionStep = { title: string; desc: string };

export type MissionProof = {
  /** o que a criança envia como prova do mundo real */
  prompt: string;
  /** bônus por prova real — propositalmente ~4x a base: sair da tela vale mais que marcar checkbox */
  bonus: number;
};

export type Mission = {
  id: number;
  day: number;
  title: string;
  /** fala do Zappy no topo da missão */
  brief: string;
  steps: MissionStep[];
  /** recompensa base (passos auto-declarados) */
  reward: number;
  proof: MissionProof;
};

export const MODULE1_NAME = 'Ideia';

export const MODULE1_MISSIONS: Mission[] = [
  {
    id: 1,
    day: 1,
    title: 'Caça à primeira ideia',
    brief: 'Sai do app agora. Pega papel ou áudio e faz isso — volta em ~10 min.',
    steps: [
      { title: 'Listei 3 coisas que adoro fazer', desc: 'Papel, notas, áudio — o formato é seu.' },
      { title: 'Perguntei pra 2 pessoas o que comprariam de mim', desc: 'Família ou amigo contam. Anote o que responderam.' },
      { title: 'Escolhi UMA ideia pra avançar', desc: 'Uma só. Pode mudar depois — mas precisa começar com uma.' },
    ],
    reward: 50,
    proof: { prompt: 'Foto da sua lista com a ideia escolhida marcada', bonus: 200 },
  },
  {
    id: 2,
    day: 2,
    title: 'Detetive de clientes',
    brief: 'Missão de campo. Observa, pergunta, anota. O app espera você voltar.',
    steps: [
      { title: 'Fui até onde meu cliente está', desc: 'Escola, rua, condomínio — onde essa pessoa fica?' },
      { title: 'Conversei com pelo menos 1 possível cliente', desc: 'O que ele disse sobre o que precisa?' },
      { title: 'Anotei o que descobri', desc: 'Papel, áudio, foto — o suporte é seu.' },
    ],
    reward: 50,
    proof: { prompt: 'Áudio ou anotação do que as pessoas responderam', bonus: 200 },
  },
  {
    id: 3,
    day: 3,
    title: 'Preço que vende',
    brief: 'Calculadora na mão. Pesquisa 3 preços lá fora e volta com os números.',
    steps: [
      { title: 'Calculei quanto custa fazer', desc: 'Material + tempo = custo real. Sem arredondar pra cima.' },
      { title: 'Pesquisei 3 preços parecidos', desc: 'Online, na loja, onde encontrar — 3 referências.' },
      { title: 'Defini o preço da minha empresa', desc: 'Custo + lucro. Um número só.' },
    ],
    reward: 50,
    proof: { prompt: 'Foto do seu cálculo: custo + lucro = preço', bonus: 200 },
  },
  {
    id: 4,
    day: 4,
    title: 'Primeira oferta',
    brief: 'Treina a frase 3x em voz alta. Depois, fala de verdade pra 3 pessoas.',
    steps: [
      { title: 'Montei minha oferta em 1 frase', desc: '"Eu vendo X por Y pra Z." Simples assim.' },
      { title: 'Falei pra 3 pessoas de verdade', desc: 'Família ou amigo por agora — o exercício é o mesmo.' },
      { title: 'Anotei o que fez os olhos brilharem', desc: 'Essa reação é o seu feedback mais valioso.' },
    ],
    reward: 50,
    proof: { prompt: 'Vídeo de 10s falando sua oferta em 1 frase', bonus: 200 },
  },
  {
    id: 5,
    day: 5,
    title: 'Plano de fundador',
    brief: 'Junta tudo no papel antes de abrir o app de novo. Essa missão começa fora daqui.',
    steps: [
      { title: 'Reuni tudo: ideia, cliente, preço, oferta', desc: 'Em papel ou áudio — onde você preferir.' },
      { title: 'Defini minha primeira meta', desc: 'Ex: vender 3 unidades essa semana. Um número concreto.' },
      { title: 'Marquei a data de começar', desc: 'Com dia. Fundador de verdade tem prazo.' },
    ],
    reward: 100,
    proof: { prompt: 'Foto do seu plano com a data marcada', bonus: 400 },
  },
];
