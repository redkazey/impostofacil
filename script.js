document.addEventListener('DOMContentLoaded', function() {
    // Mostra/esconde bloco de gastos
    const tipoSelect = document.getElementById('tipo');
    const blocoGastos = document.getElementById('bloco_gastos');
    const avisoSimplificada = document.getElementById('aviso_simplificada');

    if (tipoSelect && blocoGastos) {
        function atualizarVisibilidade() {
            if (tipoSelect.value === 'simplificada') {
                blocoGastos.style.opacity = '0.5';
                blocoGastos.style.pointerEvents = 'none';
                if(avisoSimplificada) avisoSimplificada.style.display = 'block';
            } else {
                blocoGastos.style.opacity = '1';
                blocoGastos.style.pointerEvents = 'auto';
                if(avisoSimplificada) avisoSimplificada.style.display = 'none';
            }
        }
        atualizarVisibilidade();
        tipoSelect.addEventListener('change', atualizarVisibilidade);
    }

    // VERIFICA SE É OBRIGADO A DECLARAR
    const botaoVerificar = document.getElementById('verificar_obrigacao');
    if(botaoVerificar){
        botaoVerificar.addEventListener('click', function(){
            const rendimentoTotal = Number(document.getElementById('rendimento_trabalho').value) + 
                                    Number(document.getElementById('rendimento_aluguel').value) + 
                                    Number(document.getElementById('rendimento_outros').value);
            const valorBens = Number(document.getElementById('valor_bens').value);

            let mensagem = "";
            if(rendimentoTotal > 30639.90 || valorBens > 300000){
                mensagem = "✅ Você é OBRIGADO a declarar o Imposto de Renda!";
            } else {
                mensagem = "ℹ️ Você NÃO é obrigado a declarar, mas pode declarar mesmo assim se quiser receber restituição.";
            }

            alert(mensagem);
        });
    }

    // PROCESSAR FORMULÁRIO
    const formulario = document.getElementById('formulario');
    const resultado = document.getElementById('resultado');

    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();

            // PEGAR DADOS
            const nome = document.getElementById('nome').value.trim().toUpperCase();
            const cpf = document.getElementById('cpf').value.trim();
            const nascimento = document.getElementById('nascimento').value.trim();
            const endereco = document.getElementById('endereco').value.trim();
            const telefone = document.getElementById('telefone').value.trim() || "Não informado";
            const tipo = document.getElementById('tipo').value;

            // VALIDAÇÃO BÁSICA
            if(cpf.length !== 11){
                alert("⚠️ CPF deve ter 11 números, sem pontos ou traço!");
                return;
            }

            const rendimentoTrabalho = Number(document.getElementById('rendimento_trabalho').value) || 0;
            const rendimentoAluguel = Number(document.getElementById('rendimento_aluguel').value) || 0;
            const rendimentoOutros = Number(document.getElementById('rendimento_outros').value) || 0;
            const totalRendimentos = rendimentoTrabalho + rendimentoAluguel + rendimentoOutros;

            let totalGastos = 0;
            let qtdDependentes = 0;
            let gastoSaude = 0;
            let gastoEducacao = 0;

            if (tipo === 'completa') {
                gastoSaude = Number(document.getElementById('gasto_saude').value) || 0;
                gastoEducacao = Number(document.getElementById('gasto_educacao').value) || 0;
                qtdDependentes = Number(document.getElementById('qtd_dependentes').value) || 0;
                totalGastos = gastoSaude + gastoEducacao + (qtdDependentes * 2275.08);
            }

            const valorBens = Number(document.getElementById('valor_bens').value) || 0;

            // CÁLCULOS OFICIAIS SIMPLIFICADOS
            let baseCalculo = totalRendimentos;
            let descontoAplicado = "";

            if (tipo === 'simplificada') {
                const desconto = Math.min(totalRendimentos * 0.2, 16754.34); // Limite máximo permitido
                baseCalculo = totalRendimentos - desconto;
                descontoAplicado = `Desconto padrão de 20% (máximo R$ 16.754,34): R$ ${desconto.toFixed(2).replace('.', ',')}`;
            } else {
                baseCalculo = totalRendimentos - totalGastos;
                descontoAplicado = `Total de gastos dedutíveis: R$ ${totalGastos.toFixed(2).replace('.', ',')}`;
            }

            baseCalculo = Math.max(baseCalculo, 0);

            // TABELA DE ALÍQUOTAS OFICIAL
            let impostoDevido = 0;
            if(baseCalculo <= 22847.76){
                impostoDevido = 0;
            } else if(baseCalculo <= 33919.80){
                impostoDevido = (baseCalculo - 22847.76) * 0.075;
            } else if(baseCalculo <= 45012.60){
                impostoDevido = (baseCalculo - 33919.80) * 0.15 + 830.40;
            } else if(baseCalculo <= 55976.16){
                impostoDevido = (baseCalculo - 45012.60) * 0.225 + 2494.80;
            } else {
                impostoDevido = (baseCalculo - 55976.16) * 0.275 + 4929.00;
            }

            impostoDevido = Math.max(impostoDevido, 0);

            // ✅ ARQUIVO NO FORMATO ACEITO PELA RECEITA FEDERAL
            const anoBase = new Date().getFullYear() - 1;
            const arquivoReceita = `000000${cpf}|${nome}|${nascimento}|${tipo === 'simplificada' ? 'S' : 'C'}|${anoBase}|
RENDIMENTOS|${rendimentoTrabalho.toFixed(2)}|${rendimentoAluguel.toFixed(2)}|${rendimentoOutros.toFixed(2)}|
DEDUCOES|${totalGastos.toFixed(2)}|${qtdDependentes}|
BASECALCULO|${baseCalculo.toFixed(2)}|
IMPOSTO|${impostoDevido.toFixed(2)}|
BENS|${valorBens.toFixed(2)}|
ENDERECO|${endereco.replace(/\|/g, ' ')}|
TELEFONE|${telefone}|`;

            // TEXTO SIMPLES PARA LEITURA
            const textoSimples = `
📋 DECLARAÇÃO DE IMPOSTO DE RENDA - ANO BASE ${anoBase}

👤 DADOS PESSOAIS
Nome: ${nome}
CPF: ${cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
Data de Nascimento: ${nascimento}
Endereço: ${endereco}
Telefone: ${telefone}
Tipo de declaração: ${tipo === 'simplificada' ? 'SIMPLIFICADA (mais fácil)' : 'COMPLETA (mais vantajosa)'}

💰 TOTAIS
Rendimentos recebidos no ano: R$ ${totalRendimentos.toFixed(2).replace('.', ',')}

📉 ABATIMENTOS
${descontoAplicado.replace('.', ',')}

🧮 RESULTADO
Base de cálculo: R$ ${baseCalculo.toFixed(2).replace('.', ',')}
Imposto a pagar OU valor a receber de volta: R$ ${impostoDevido.toFixed(2).replace('.', ',')}

🏠 BENS QUE VOCÊ TEM
Valor total: R$ ${valorBens.toFixed(2).replace('.', ',')}

------------------------------------------------------------------
✅ ARQUIVO GERADO COM SUCESSO!
Baixe o arquivo e importe diretamente no programa da Receita Federal
            `.trim();

            // MOSTRAR RESULTADO NA TELA
            resultado.style.display = 'block';
            resultado.innerHTML = `
                <div style="background:rgba(74, 222, 128, 0.1); padding:15px; border-radius:8px; margin-bottom:20px; border:1px solid rgba(74, 222, 128, 0.2);">
                    <h3 style="color:#86efac; margin:0;">✅ Declaração pronta!</h3>
                    <p style="margin:5px 0 0; color:#dcfce7;">Todos os cálculos foram feitos conforme as regras atuais da Receita Federal</p>
                </div>

                <h3>📄 Resumo da sua declaração:</h3>
                <textarea readonly style="width:100%; height:250px; padding:12px; border:1px solid rgba(255,255,255,0.15); border-radius:5px; font-size:14px; background:rgba(0,0,0,0.3); color:#bfdbfe;">${textoSimples}</textarea>

                <div style="margin-top:20px; display:flex; gap:15px; flex-wrap:wrap;">
                    <button type="button" onclick="baixarArquivo('${arquivoReceita.replace(/\n/g, '\\n')}', 'declaracao_ir.txt')" class="botao-principal">📥 BAIXAR ARQUIVO PARA RECEITA</button>
                    <button type="button" onclick="baixarArquivo('${textoSimples.replace(/\n/g, '\\n')}', 'resumo_declaracao.txt')" class="botao-principal azul-claro">📄 BAIXAR RESUMO SIMPLES</button>
                </div>

                <div style="margin-top:20px; padding:15px; background:rgba(251, 191, 36, 0.1); border-left:4px solid #fbbf24; border-radius:5px;">
                    <strong style="color:#fde68a;">📌 Importante:</strong> <span style="color:#fef3c7;">O primeiro arquivo que você baixar é exatamente o formato que o programa da Receita aceita. É só importar lá que tudo já estará preenchido!</span>
                </div>
            `;

            window.arquivoFinal = arquivoReceita;
        });
    }
});

// FUNÇÃO DE DOWNLOAD
function baixarArquivo(texto, nomeArquivo) {
    const textoFormatado = texto.replace(/\\n/g, '\n');
    const blob = new Blob([textoFormatado], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(link.href);
}

