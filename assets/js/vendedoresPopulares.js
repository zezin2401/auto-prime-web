async function carregarVendedoresPopulares() {
    try {
        const response = await fetch("http://10.92.3.210:5000/vendedores/populares", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const dados = await response.json();
        const vendedores = dados.vendedores_populares || [];

        console.log("Vendedores populares carregados:", vendedores);

        const container = document.querySelector(".vendedores-populares");

        if (!container) {
            console.warn("Elemento .vendedores-populares não existe na Home!");
            return;
        }

        container.innerHTML = "";

        vendedores.slice(0, 4).forEach((v) => {
            const linha = document.createElement("div");
            linha.classList.add("vendedor-linha");

            linha.innerHTML = `
                <div class="vendedor-detalhes">
                    <div class="icone">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="separacao-nome-info">
                        <div class="nome">
                            <p>${v.nome}</p>
                        </div>

                        <div class="info-vendedor">
                            <p class="total">Vendas:<span class="negrito"> ${v.total_vendas}</span></p>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(linha);
        });

    } catch (error) {
        console.error("Erro ao carregar vendedores populares:", error);
    }
}

window.addEventListener("load", carregarVendedoresPopulares);