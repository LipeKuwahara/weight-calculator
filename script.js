const url = "https://docs.google.com/spreadsheets/d/1FPC9CEtkGzKwj_64NINn1cUJhmMVjUPcxnIcgBsw9Jg/gviz/tq?tqx=out:csv&sheet=principal";

const portas = async () => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const csvData = await response.text();
        const rows = csvData.split("\n").map(row => row.split(","));

        // A primeira linha contém os cabeçalhos (chaves dos objetos)
        const headers = rows.shift();

        // Mapeia cada linha para um objeto e remove aspas extras
        let formattedData = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                const value = row[index]?.trim().replace(/^"|"$/g, "") || ""; // Remove aspas duplas no início e no fim
                obj[header.trim().replace(/^"|"$/g, "")] = value;
            });
            return obj;
        });

        // Converte a propriedade "valor" para número
        formattedData = formattedData.map(item => ({
            ...item,
            valor: Number(item.valor)
        }));

        console.log(formattedData); // Lista de objetos
        return formattedData;
    } catch (error) {
        console.error("Erro ao buscar ou processar dados:", error);
    }
};

// Preenche o select com os valores dinâmicos
async function preencherSelect() {
    const select = document.getElementById('modelo');
    try {
        const dadosPortas = await portas(); // Aguarda os dados serem carregados
        if (dadosPortas && Array.isArray(dadosPortas)) {
            dadosPortas.forEach(porta => {
                const option = document.createElement('option');
                option.value = porta.valor;
                option.textContent = porta.porta; // Texto visível no dropdown
                select.appendChild(option);
            });
        } else {
            console.error("Os dados das portas não estão no formato esperado.");
        }
    } catch (error) {
        console.error("Erro ao preencher o select:", error);
    }
}

// Chama a função para preencher o select
preencherSelect();

let massaPerfil = 0.454; // Valor padrão para o perfil VT2163
let densidadeVidro = 10; // Densidade padrão para vidro de 4 mm

// Função para atualizar a massa do perfil de acordo com o modelo selecionado
function atualizarMassaPerfil() {
    const modeloSelect = document.getElementById('modelo');
    massaPerfil = parseFloat(modeloSelect.value);
}

// Função para atualizar a densidade do vidro de acordo com a espessura selecionada
function atualizarDensidadeVidro() {
    const espessuraSelect = document.getElementById('espessuraVidro');
    densidadeVidro = parseFloat(espessuraSelect.value);
}

function calcularPeso() {
    // Obtém os valores de entrada
    const larguraMM = parseFloat(document.getElementById('larguraMM').value);
    const alturaMM = parseFloat(document.getElementById('alturaMM').value);

    // Valida os inputs
    if (isNaN(larguraMM) || isNaN(alturaMM)) {
        alert("Por favor, insira valores válidos.");
        return;
    }

    // Conversores para metros
    const larguraM = larguraMM / 1000;
    const alturaM = alturaMM / 1000;

    // Calcula o peso do perfil de alumínio
    const pesoRequadro = (alturaM + larguraM) * 2 * massaPerfil;

    // Verifica se o perfil é "AREZZO" e ajusta o cálculo
    if (modeloSelecionado === "AREZZO") {
        pesoVidro *= 2; // Multiplica por 2 para o perfil "AREZZO"
    }
    
    // Calcula o peso do vidro
    const area = larguraM * alturaM;
    const pesoVidro = area * densidadeVidro;

    // Calcula o peso total
    const pesoTotal = pesoVidro + pesoRequadro;

    // Exibe o resultado
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `
        <p>Peso do vidro (${densidadeVidro} kg/m²): ${pesoVidro.toFixed(2)} kg</p>
        <p>Peso do perfil de alumínio (${massaPerfil} kg/m): ${pesoRequadro.toFixed(2)} kg</p>
        <h3>Peso total: ${pesoTotal.toFixed(2)} kg</h3>
    `;
}
