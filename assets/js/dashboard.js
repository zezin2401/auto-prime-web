(() => {
  const BASE = "http://10.92.3.194:5000";

  function fmtNumber(n) {
    return (n === null || n === undefined) ? '0' : Number(n).toLocaleString('pt-BR');
  }
  function fmtCurrency(n) {
    return (n === null || n === undefined) ? 'R$ 0,00' : Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  async function fetchJson(url, opts) {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
    return res.json();
  }

  async function atualizarDash() {
    try {
        
      const [usuariosResp, produtosResp, vendasResp, cashbacksResp] = await Promise.all([
        fetchJson(`${BASE}/cadastro`),
        fetchJson(`${BASE}/produtos`),
        fetchJson(`${BASE}/vendas`),
        fetchJson(`${BASE}/cashbacks`)
      ]);

      const usuarios = Array.isArray(usuariosResp.cadastro) ? usuariosResp.cadastro : (Array.isArray(usuariosResp) ? usuariosResp : []);
      const totalUsuarios = usuarios.length;

      const produtos = Array.isArray(produtosResp.produtos) ? produtosResp.produtos : (Array.isArray(produtosResp) ? produtosResp : []);
      const totalProdutos = produtos.length;

      const vendas = Array.isArray(vendasResp) ? vendasResp : [];
      const totalVendas = vendas.length;
      const valorVendasTotal = vendas.reduce((acc, v) => acc + (Number(v.valor_total) || 0), 0);

      const cashbacks = Array.isArray(cashbacksResp) ? cashbacksResp : [];
      const totalCashbackValor = cashbacks.reduce((acc, c) => acc + (Number(c.valor_cashback) || 0), 0);
      const idei = Array.from(document.querySelectorAll('.ideiagenial'));
      if (idei.length >= 4) {
        const usuariosEl = idei[0].querySelector('.numero-info');
        const vendasEl = idei[1].querySelector('.numero-info');
        const produtosEl = idei[2].querySelector('.numero-info');
        const cashbackEl = idei[3].querySelector('.numero-info');

        if (usuariosEl) usuariosEl.textContent = fmtNumber(totalUsuarios);
        if (vendasEl) vendasEl.textContent = fmtCurrency(valorVendasTotal);
        if (produtosEl) produtosEl.textContent = fmtNumber(totalProdutos);
        if (cashbackEl) cashbackEl.textContent = fmtCurrency(totalCashbackValor);
      } else {
        const elU = document.getElementById('total') || document.getElementById('usuariosCount');
        const elP = document.getElementById('total-produtos');
        const elV = document.querySelector('.div-azul .capital') || document.querySelector('.div-verde .qtd');
        const elC = document.querySelector('.div-azul .capital') || document.querySelector('.info-segmento-cashback .numero-info');

        if (elU) elU.textContent = fmtNumber(totalUsuarios);
        if (elP) elP.textContent = fmtNumber(totalProdutos);
        if (elV) {
          elV.textContent = fmtCurrency(valorVendasTotal);
        }
        if (elC) elC.textContent = fmtCurrency(totalCashbackValor);
      }

      document.querySelectorAll('.detalhes-card').forEach(block => {
        const title = (block.querySelector('.info-titulo p') || {}).textContent || '';
        const numEl = block.querySelector('.numero-info');
        if (!numEl) return;
        if (/usuários?/i.test(title)) numEl.textContent = fmtNumber(totalUsuarios);
        else if (/vendas?/i.test(title)) numEl.textContent = fmtCurrency(valorVendasTotal);
        else if (/produtos?/i.test(title)) numEl.textContent = fmtNumber(totalProdutos);
        else if (/cashback/i.test(title)) numEl.textContent = fmtCurrency(totalCashbackValor);
      });

      console.log('[dash] atualizada:', { totalUsuarios, totalProdutos, totalVendas, valorVendasTotal, totalCashbackValor });
    } catch (err) {
      console.error('Erro ao atualizar dashboard:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    atualizarDash();
  });
})();