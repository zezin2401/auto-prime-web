async function carregarVendas() {
    try {
        const requestOptions = {
            method: "GET",
            body: "",
            redirect: "follow"
        };

        const response = await fetch("http://10.92.3.194:5000/vendas", requestOptions);
        const resultado = await response.text();

        console.log("Retorno da rota /vendas:");
        console.log(resultado);

    } catch (error) {
        console.error("Erro ao buscar vendas:", error);
    }
}

window.addEventListener("load", carregarVendas);