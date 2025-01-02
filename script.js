let massaPerfil = 1.2; // Valor padrão para o perfil (modelo A)
let densidadeVidro = 25; // Densidade padrão para vidro de 3 mm

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
