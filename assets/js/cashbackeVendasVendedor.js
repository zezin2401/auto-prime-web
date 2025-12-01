document.addEventListener("DOMContentLoaded", async () => {

    const API = "http://10.92.3.165:5000";

    // --- pegar ID logado ---
    const id = localStorage.getItem("id_cadastro");
    if (!id) {
        console.error("Nenhum ID encontrado no localStorage");
        return;
    }

    try {
        const resp = await fetch(`${API}/cashback/total/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const dados = await resp.json();
        console.log("Total de cashback:", dados);

        document.getElementById("cashbackValor").innerText =
            `R$: ${Number(dados.total_cashback).toFixed(2)}`;

    } catch (e) {
        console.error("Erro ao buscar total de cashback:", e);
    }

    try {
        const vendasResp = await fetch(`${API}/historico_vendas/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const vendas = await vendasResp.json();
        console.log("Histórico de vendas:", vendas);


    } catch (e) {
        console.error("Erro ao carregar histórico de vendas:", e);
    }

});