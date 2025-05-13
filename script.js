(() => {
  const wall = document.getElementById('wall');
  const hpValueEl = document.getElementById('hpValue');
  const hpBarInner = document.getElementById('hpBarInner');
  const MAX_BRICKS = 50; // 5 linhas x 10 colunas
  const ROWS = 12;
  const COLS = 8;
  
  // Cores disponíveis e HP inicial relacionado
  const wallTypes = [
    {name: 'vermelho', hp: 50, className: 'red'},
    {name: 'laranja', hp: 70, className: 'orange'},
    {name: 'dourado', hp: 120, className: 'gold'},
    {name: 'cinza', hp: 30, className: 'gray'},
    {name: 'rainbow', hp: 200, className: 'rainbow'}
  ];
  
  let currentWallType;
  let currentHP;
  let bricks = [];
  
  // Função para criar um tijolo
  function createBrick() {
    const brick = document.createElement('div');
    brick.classList.add('brick', currentWallType.className);
    brick.style.opacity = '1';
    return brick;
  }
  
  // Construir muro tijolo a tijolo (visualmente)
  function buildWall() {
    wall.innerHTML = '';
    bricks = [];
    wall.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    
    // Colocar tijolos por linhas e colunas
    for (let i = 0; i < ROWS * COLS; i++) {
      const brick = createBrick();
      wall.appendChild(brick);
      bricks.push(brick);
    }
  }
  
  // Atualizar barra e valor HP
  function updateHP(amount) {
    currentHP = Math.max(0, currentHP - amount);
    hpValueEl.textContent = currentHP;
    
    const widthPercent = (currentHP / currentWallType.hp) * 100;
    hpBarInner.style.width = widthPercent + '%';

    // Cor da barra muda de verde para vermelho progressivamente
    if (widthPercent > 60) {
      hpBarInner.style.backgroundColor = '#27ae60'; // verde
    } else if (widthPercent > 30) {
      hpBarInner.style.backgroundColor = '#f39c12'; // amarelo
    } else {
      hpBarInner.style.backgroundColor = '#c0392b'; // vermelho
    }
  }
  
  // Função que calcula o dano do soco (fixo ou aleatório pequeno)
  function getDamage() {
    // Dano random entre 7 e 12 por soco para dar mais dinâmica
    return Math.floor(Math.random() * 6) + 7;
  }
  
  // Mostrar rachaduras e quebrar tijolos conforme HP diminui
  function brickBreakAnimation() {
    // Quantidade de tijolos para remover proporcional ao HP perdido
    const hpRatio = currentHP / currentWallType.hp;
    // Quantos tijolos devem estar visíveis
    const bricksToShow = Math.ceil(hpRatio * MAX_BRICKS);

    bricks.forEach((brick, index) => {
      if (index >= bricksToShow) {
        if (!brick.classList.contains('broken')) {
          // Animate brick breaking
          brick.classList.add('broken');
          brick.style.opacity = '0';
          brick.style.pointerEvents = 'none';
        }
      } else {
        if (brick.classList.contains('broken')) {
          brick.classList.remove('broken');
          brick.style.opacity = '1';
          brick.style.pointerEvents = 'auto';
          brick.classList.remove('crack');
        }
        // Adiciona rachaduras com probabilidade quando o muro está parcialmente danificado
        if (hpRatio < 1 && hpRatio > 0.3 && Math.random() < 0.15) {
          brick.classList.add('crack');
        } else {
          brick.classList.remove('crack');
        }
      }
    });
  }
  
  // Criar novo muro com cor e HP aleatória
  function newWall() {
    // Escolhe cor diferente da atual
    let choices = wallTypes.filter(w => w.name !== (currentWallType ? currentWallType.name : null));
    currentWallType = choices[Math.floor(Math.random() * choices.length)];
    currentHP = currentWallType.hp;
    updateHP(0);
    buildWall();
  }
  
  // Clique ou toque no muro para socar e diminuir HP
  function punchWall() {
    if (currentHP <= 0) return;
    const damage = getDamage();
    updateHP(damage);
    brickBreakAnimation();
    
    if (currentHP <= 0) {
      // Espera animação tijolos desaparecerem antes de trocar o muro
      setTimeout(() => {
        newWall();
      }, 900);
    }
  }
  
  // Inicializa o jogo
  function init() {
    newWall();
    wall.addEventListener('click', punchWall);
    wall.addEventListener('touchstart', (e) => {
      e.preventDefault();
      punchWall();
    }, {passive:false});
  }
  
  // Começa o jogo ao carregar
  window.onload = init;
})();
