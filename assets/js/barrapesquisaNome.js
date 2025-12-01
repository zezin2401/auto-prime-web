(() => {
    const BASE = "http://10.92.3.165:5000";
    const inputSelector = ".barra-pesquisar";
    const minChars = 2;
    const debounceMs = 350;

    function escapeHtml(s = "") {
        return String(s)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function debounce(fn, ms) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), ms);
        };
    }

    function createResultsContainer() {
        let container = document.querySelector("body > .search-results--global");
        if (!container) {
            container = document.createElement("div");
            container.className = "search-results--global";
            Object.assign(container.style, {
                position: "absolute",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "6px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                maxHeight: "320px",
                overflow: "auto",
                zIndex: 9999,
                padding: "6px 0",
                display: "none",
                minWidth: "200px"
            });
            document.body.appendChild(container);
        }
        return container;
    }

    function positionContainer(input, container) {
        const rect = input.getBoundingClientRect();
        const left = rect.left + window.scrollX;
        const top = rect.bottom + window.scrollY + 6;
        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
        container.style.width = `${Math.max(220, rect.width)}px`;
    }

    function renderEmpty(container, msg = "Nenhum resultado") {
        container.innerHTML = `<div style="padding:12px;color:#666">${escapeHtml(msg)}</div>`;
        container.style.display = "block";
    }

    function renderError(container, msg = "Erro ao buscar") {
        container.innerHTML = `<div style="padding:12px;color:#c00">${escapeHtml(msg)}</div>`;
        container.style.display = "block";
    }

    function renderResults(container, items = [], input) {
        if (!items || items.length === 0) {
            return renderEmpty(container, "Nenhum resultado");
        }

        container.innerHTML = items.map(it => {
            const nome = escapeHtml(it.nome || it.NOME || it.nome_cliente || it.nome_cadastro || "—");
            const email = escapeHtml(it.email || it.EMAIL || it.email_cliente || "");
            const cargo = escapeHtml(it.cargo || it.CARGO || "");
            const id = encodeURIComponent(it.id || it.ID || it.id_cadastro || "");
            return `
        <div class="search-row" data-id="${id}" style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-bottom:1px solid #f4f4f4;cursor:pointer;">
          <div style="flex:1;">
            <div style="font-weight:600">${nome}${email ? ` <span style="font-weight:400;color:#666"> — ${email}</span>` : ''}</div>
            <div style="font-size:13px;color:#777">${cargo}</div>
          </div>
          <div style="white-space:nowrap;background-color:rgb(0, 140, 255);font-weight:bold;color:#fff;padding:4px 8px;border-radius:5px;">Editar</div>
        </div>
      `;
        }).join("");
        container.style.display = "block";

        // click nas linhas
        container.querySelectorAll(".search-row").forEach(row => {
            row.addEventListener("click", () => {
                const id = row.getAttribute("data-id") || "";
                if (id) window.location.href = `editar.html?id=${id}`;
            });
        });

        // reposition after content change (in case of scrollbar)
        if (input) positionContainer(input, container);
    }

    async function searchByName(q, container, input) {
        if (!q || q.length < minChars) {
            return renderEmpty(container, `Digite pelo menos ${minChars} caracteres.`);
        }
        try {
            const url = `${BASE}/cadastro/nome/${encodeURIComponent(q)}`;
            const res = await fetch(url, { method: "GET", redirect: "follow" });
            const text = await res.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                return renderError(container, `Resposta inesperada do servidor: ${text}`);
            }

            let items = [];
            if (Array.isArray(data)) items = data;
            else if (Array.isArray(data.cadastro)) items = data.cadastro;
            else if (Array.isArray(data.resultado)) items = data.resultado;
            else if (data.cadastro && typeof data.cadastro === 'object') items = [data.cadastro];
            else items = Object.values(data).find(v => Array.isArray(v)) || [];

            renderResults(container, items, input);
        } catch (err) {
            console.error("Erro na busca por nome:", err);
            renderError(container, "Erro ao conectar com o servidor.");
        }
    }

    function init() {
        const input = document.querySelector(inputSelector);
        if (!input) {
            console.warn("[barraPesquisaNome] input não encontrado:", inputSelector);
            return;
        }

        const container = createResultsContainer();
        positionContainer(input, container);
        renderEmpty(container, "Digite para buscar por nome...");

        const debounced = debounce(q => searchByName(q, container, input), debounceMs);

        input.addEventListener("input", (e) => {
            const q = (e.target.value || "").trim().toLowerCase();

            if (q.length < minChars) {
                renderEmpty(container, `Digite pelo menos ${minChars} caracteres.`);
                return;
            }
            debounced(q);
        });

        input.addEventListener("focus", () => {
            positionContainer(input, container);
            if (input.value && input.value.trim().length >= minChars) {
                searchByName((input.value || "").trim().toLowerCase(), container, input);

            } else {
                container.style.display = "block";
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                searchByName((input.value || "").trim(), container, input);
            } else if (e.key === "Escape") {
                container.style.display = "none";
            }
        });

        // fechar ao clicar fora
        document.addEventListener("click", (ev) => {
            if (!container.contains(ev.target) && ev.target !== input) {
                container.style.display = "none";
            }
        });

        // reposiciona em scroll / resize
        window.addEventListener("resize", () => positionContainer(input, container));
        window.addEventListener("scroll", () => positionContainer(input, container), { passive: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
