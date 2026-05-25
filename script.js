document.addEventListener('DOMContentLoaded', function() {
    // 📱 MENU RECOLHIDO
    const botaoMenu = document.getElementById('abrirMenu');
    const menuNavegacao = document.getElementById('menuNavegacao');

    botaoMenu.addEventListener('click', function() {
        menuNavegacao.classList.toggle('menu-aberto');
        botaoMenu.textContent = menuNavegacao.classList.contains('menu-aberto') ? '✕' : '☰';
    });

    // 📂 ALTERNAR ENTRE PF E PJ
    const tipoContribuinte = document.getElementById('tipo_contribuinte');
    const camposFisica = document.getElementById('campos_fisica');
    const camposJuridica = document.getElementById('campos_juridica');
    const opcaoDeclaracao = document.getElementById('opcao_declaracao');
    const tituloRendimento = document.getElementById('titulo_rendimento');
    const camposPf = document.getElementById('campos_pf');
    const camposPj = document.getElementById('campos_pj');
    const tituloGastos = document.getElementById('titulo_gastos');
    const gastosPf = document.getElementById('gastos_pf');
    const gastosPj = document.getElementById('gastos_pj');
    const tituloBens = document.getElementById('titulo_bens');
    const bensPf = document.getElementById('bens_pf');
    const bensPj = document.getElementById('bens_pj');
    const blocoGastos = document.getElementById('bloco_gastos');
    const avisoSimplificada = document.getElementById('aviso_simplificada');
    const tipoSelect = document.getElementById('tipo');
    const botaoConferir = document.getElementById('botao_conferir');

    // AVISOS DE VALIDAÇÃO
    const avisoNome = document.getElementById('aviso_nome');
    const avisoCpf = document.getElementById('aviso_cpf');

    // ÁREAS DE CONFERÊNCIA
    const areaConferencia = document.getElementById('area_conferencia');
    const conteudoResumo = document.getElementById('conteudo_resumo');
    const areaFinal = document.getElementById('area_final');
    let dadosSalvos = {};
    let calculosSalvos = {};
    let textoArquivo = "";
    let dadosValidos = false;

    // ✅ FORMATAÇÃO AUTOMÁTICA DE CAMPOS
    // CPF + VERIFICAÇÃO CONJUNTA COM NOME
    const campoNome = document.getElementById('nome');
    const campoCpf = document.getElementById('cpf');

    campoNome.addEventListener('input', verificarDadosPessoa);
    campoCpf.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if(valor.length > 11) valor = valor.slice(0,11);
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = valor;
        verificarDadosPessoa();
    });

    // FUNÇÃO PRINCIPAL DE VERIFICAÇÃO NOME + CPF
    function verificarDadosPessoa() {
        const nomeDigitado = campoNome.value.trim().toUpperCase();
        const cpfDigitado = campoCpf.value.replace(/\D/g, '');

        // Resetar estado
        dadosValidos = false;
        botaoConferir.disabled = true;
        campoNome.style.borderColor = '';
        campoCpf.style.borderColor = '';
        avisoNome.textContent = 'ℹ️ Digite exatamente como está no CPF';
        avisoNome.style.color = '#bdbdbd';
        avisoCpf.textContent = 'ℹ️ Ao digitar o CPF, verificaremos se bate com o nome informado';
        avisoCpf.style.color = '#bdbdbd';

        // Se os dois campos estiverem preenchidos
        if(nomeDigitado.length >= 5 && cpfDigitado.length === 11) {
            // Validar estrutura do CPF
            if(!validarCPF(cpfDigitado)) {
                // CPF inválido
                campoNome.style.borderColor = '#f87171';
                campoCpf.style.borderColor = '#f87171';
                avisoNome.textContent = '❌ Dados inválidos';
                avisoNome.style.color = '#f87171';
                avisoCpf.textContent = '❌ CPF inválido! Não corresponde a nenhum cadastro';
                avisoCpf.style.color = '#f87171';
                return;
            }

            // SIMULAÇÃO DE CONSULTA À BASE DA RECEITA
            // Aqui simulamos a verificação: nome deve ter no mínimo 2 nomes e não ter números
            const nomeValido = /^[A-ZÃÁÂÊÉÍÓÔÕÚÇ ]+$/.test(nomeDigitado) && nomeDigitado.split(' ').length >= 2;

            if(nomeValido) {
                // ✅ TUDO CERTO
                dadosValidos = true;
                botaoConferir.disabled = false;
                campoNome.style.borderColor = '#86efac';
                campoCpf.style.borderColor = '#86efac';
                avisoNome.textContent = '✅ Nome confirmado';
                avisoNome.style.color = '#86efac';
                avisoCpf.textContent = '✅ CPF corresponde ao nome informado';
                avisoCpf.style.color = '#86efac';
            } else {
                // ❌ NOME NÃO BATE OU ESTÁ ERRADO
                campoNome.style.borderColor = '#f87171';
                campoCpf.style.borderColor = '#f87171';
                avisoNome.textContent = '❌ NOME NÃO CONFERE COM O DOCUMENTO';
                avisoNome.style.color = '#f87171';
                avisoCpf.textContent = '❌ DIGITE DADOS CORRESPONDENTES E VÁLIDOS';
                avisoCpf.style.color = '#f87171';
            }
        }
    }

    // VALIDAR ESTRUTURA DO CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if(cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0;
        for(let i=0; i<9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let digito1 = 11 - (soma % 11);
        if(digito1 > 9) digito1 = 0;

        soma = 0;
        for(let i=0; i<10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        let digito2 = 11 - (soma % 11);
        if(digito2 > 9) digito2 = 0;

        return digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10));
    }

    // DEMAIS FORMATAÇÕES
    // CNPJ
    document.getElementById('cnpj').addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if(valor.length > 14) valor = valor.slice(0,14);
        valor = valor.replace(/(\d{2})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1/$2');
        valor = valor.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        e.target.value = valor;
    });

    // DATA DE NASCIMENTO
    document.getElementById('nascimento').addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if(valor.length > 8) valor = valor.slice(0,8);
        valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
        valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
        e.target.value = valor;
    });

    // TELEFONE COM DDD
    document.getElementById('telefone').addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if(valor.length > 11) valor = valor.slice(0,11);
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = valor;
    });

    // CEP
    document.getElementById('cep').addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if(valor.length > 8) valor = valor.slice(0,8);
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = valor;
    });

    // ✅ CONSULTA CEP - PREENCHE ENDEREÇO AUTOMÁTICO
    document.getElementById('cep').addEventListener('blur', async function() {
        let cep = this.value.replace(/\D/g, '');
        if(cep.length !== 8) return;

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if(!dados.erro) {
                document.getElementById('rua').value = dados.logradouro || '';
                document.getElementById('bairro').value = dados.bairro || '';
                document.getElementById('cidade').value = dados.localidade || '';
                document.getElementById('estado').value = dados.uf || '';
                document.getElementById('numero').focus();
            } else {
                alert('CEP não encontrado! Verifique o número digitado.');
                limparEndereco();
            }
        } catch(erro) {
            alert('Erro ao consultar CEP. Tente novamente mais tarde.');
            limparEndereco();
        }
    });

    function limparEndereco() {
        document.getElementById('rua').value = '';
        document.getElementById('bairro').value = '';
        document.getElementById('cidade').value = '';
        document.getElementById('estado').value = '';
    }

    // ✅ FORMATAÇÃO DE VALORES EM TEMPO REAL
    document.querySelectorAll('.campo-valor').forEach(campo => {
        campo.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            valor = (valor / 100).toFixed(2) + '';
            valor = valor.replace('.', ',');
            valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            e.target.value = 'R$ ' + valor;
        });
    });

    function alternarCampos() {
        if(tipoContribuinte.value === 'fisica'){
            camposFisica.style.display = 'block';
            camposJuridica.style.display = 'none';
            opcaoDeclaracao.style.display = 'block';
            tituloRendimento.textContent = '💰 Quanto ganhou no ano todo?';
            camposPf.style.display = 'block';
            camposPj.style.display = 'none';
            tituloGastos.textContent = '💸 Gastos que podem ser abatidos';
            gastosPf.style.display = 'block';
            gastosPj.style.display = 'none';
            tituloBens.textContent = '🏠 Bens ou valores que você tem';
            bensPf.style.display = 'block';
            bensPj.style.display = 'none';
            atualizarVisibilidade();
            verificarDadosPessoa();
        } else {
            camposFisica.style.display = 'none';
            camposJuridica.style.display = 'block';
            opcaoDeclaracao.style.display = 'none';
            tituloRendimento.textContent = '💰 Total de vendas e receitas do ano';
            camposPf.style.display = 'none';
            camposPj.style.display = 'block';
            tituloGastos.textContent = '💸 Despesas e gastos da empresa';
            gastosPf.style.display = 'none';
            gastosPj.style.display = 'block';
            tituloBens.textContent = '🏢 Bens, dívidas e valores da empresa';
            bensPf.style.display = 'none';
            bensPj.style.display = 'block';
            blocoGastos.style.opacity = '1';
            blocoGastos.style.pointerEvents = 'auto';
            botaoConferir.disabled = false;
        }
    }

    alternarCampos();
    tipoContribuinte.addEventListener('change', alternarCampos);

    // MOSTRAR/ESCONDER GASTOS PF
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
    if(tipoSelect) tipoSelect.addEventListener('change', atualizarVisibilidade);

    // ✅ FUNÇÃO PARA SOMAR VALORES SEPARADOS OU ÚNICOS
    function calcularValor(textoCampo) {
        if (!textoCampo || textoCampo.trim() === '' || textoCampo === 'R$ 0,00') return 0;
        let valorLimpo = textoCampo.replace('R$ ', '').replace(/\./g, '').replace(/,/g, '.');
        return Number(valorLimpo) || 0;
    }

    // VERIFICAR OBRIGAÇÃO
    const botaoVerificar = document.getElementById('verificar_obrigacao');
    if(botaoVerificar){
        botaoVerificar.addEventListener('click', function(){
            let mensagem = "";
            if(tipoContribuinte.value === 'fisica'){
                if(!dadosValidos) {
                    alert('⚠️ Primeiro corrija os dados de Nome e CPF para continuar!');
                    return;
                }
                const totalRendimentos = calcularValor(document.getElementById('rendimento_trabalho').value) + 
                                        calcularValor(document.getElementById('rendimento_aluguel').value) + 
                                        calcularValor(document.getElementById('rendimento_outros').value);
                const valorBens = calcularValor(document.getElementById('valor_bens').value);
                if(totalRendimentos > 30639.90 || valorBens > 300000){
                    mensagem = "✅ Você é OBRIGADO a declarar o Imposto de Renda!";
                } else {
                    mensagem = "ℹ️ Você NÃO é obrigado a declarar, mas pode declarar mesmo assim se quiser receber restituição.";
                }
            } else {
                mensagem = "✅ Toda Pessoa Jurídica com CNPJ ativo é OBRIGADA a entregar a declaração anual!";
            }
            alert(mensagem);
        });
    }

    // 📋 ETAPA 1: MOSTRAR RESUMO PARA CONFERÊNCIA
    const formulario = document.getElementById('formulario');
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();

        // BLOQUEAR ENVIO SE DADOS NÃO FOREM VÁLIDOS
        if(tipoContribuinte.value === 'fisica' && !dadosValidos) {
            alert('❌ Corrija os dados de Nome e CPF primeiro! Eles não correspondem ou estão inválidos.');
            return;
        }

        let dados = {};
        let calculos = {};
        let textoResumo = "";
        const anoBase = new Date().getFullYear() - 1;

        // 📋 PEGAR DADOS E CALCULAR
        if(tipoContribuinte.value === 'fisica'){
            dados = {
                tipo: 'PESSOA FÍSICA',
                nome: document.getElementById('nome').value.trim().toUpperCase(),
                documento: document.getElementById('cpf').value.trim(),
                nascimento: document.getElementById('nascimento').value.trim(),
                endereco: `${document.getElementById('rua').value}, Nº ${document.getElementById('numero').value} ${document.getElementById('complemento').value ? '- ' + document.getElementById('complemento').value : ''} - ${document.getElementById('bairro').value} - ${document.getElementById('cidade').value}/${document.getElementById('estado').value} - CEP: ${document.getElementById('cep').value}`,
                telefone: document.getElementById('telefone').value.trim() || "Não informado",
                tipo_declaracao: document.getElementById('tipo').value
            };

            // CÁLCULOS PF
            const rendimentoTrabalho = calcularValor(document.getElementById('rendimento_trabalho').value);
            const rendimentoAluguel = calcularValor(document.getElementById('rendimento_aluguel').value);
            const rendimentoOutros = calcularValor(document.getElementById('rendimento_outros').value);
            const totalRendimentos = rendimentoTrabalho + rendimentoAluguel + rendimentoOutros;

            let totalGastos = 0;
            if(dados.tipo_declaracao === 'completa'){
                const gastoSaude = calcularValor(document.getElementById('gasto_saude').value);
                const gastoEducacao = calcularValor(document.getElementById('gasto_educacao').value);
                const qtdDependentes = Number(document.getElementById('qtd_dependentes').value) || 0;
                totalGastos = gastoSaude + gastoEducacao + (qtdDependentes * 2275.08);
            }

            let baseCalculo = totalRendimentos;
            let descontoAplicado = "";

            if(dados.tipo_declaracao === 'simplificada'){
                const desconto = Math.min(totalRendimentos * 0.2, 16754.34);
                baseCalculo = totalRendimentos - desconto;
                descontoAplicado = `Desconto padrão de 20%: R$ ${desconto.toFixed(2).replace('.', ',')}`;
            } else {
                baseCalculo = totalRendimentos - totalGastos;
                descontoAplicado = `Total de gastos dedutíveis: R$ ${totalGastos.toFixed(2).replace('.', ',')}`;
            }

            baseCalculo = Math.max(baseCalculo, 0);
            let impostoDevido = 0;

            if(baseCalculo <= 22847.76) impostoDevido = 0;
            else if(baseCalculo <= 33919.80) impostoDevido = (baseCalculo - 22847.76) * 0.075;
            else if(baseCalculo <= 45012.60) impostoDevido = (baseCalculo - 33919.80) * 0.15 + 830.40;
            else if(baseCalculo <= 55976.16) impostoDevido = (baseCalculo - 45012.60) * 0.225 + 2494.80;
            else impostoDevido = (baseCalculo - 55976.16) * 0.275 + 4929.00;

            impostoDevido = Math.max(impostoDevido, 0);
            const valorBens = calcularValor(document.getElementById('valor_bens').value);

            calculos = { totalRendimentos, descontoAplicado, baseCalculo, impostoDevido, valorBens };

            // 📄 TEXTO DO RESUMO PF
            textoResumo = `
👤 DADOS PESSOAIS
Nome: ${dados.nome}
CPF: ${dados.documento}
Data de Nascimento: ${dados.nascimento}
Endereço: ${dados.endereco}
Telefone: ${dados.telefone}
Tipo de Declaração: ${dados.tipo_declaracao === 'simplificada' ? '✅ SIMPLIFICADA' : '📋 COMPLETA'}

💰 RENDIMENTOS DO ANO
Trabalho: R$ ${rendimentoTrabalho.toFixed(2).replace('.', ',')}
Aluguel: R$ ${rendimentoAluguel.toFixed(2).replace('.', ',')}
Outros: R$ ${rendimentoOutros.toFixed(2).replace('.', ',')}
TOTAL RECEBIDO: R$ ${totalRendimentos.toFixed(2).replace('.', ',')}

📉 ABATIMENTOS E GASTOS
${descontoAplicado.replace('.', ',')}

🧮 RESULTADO FINAL
Base de cálculo: R$ ${baseCalculo.toFixed(2).replace('.', ',')}
IMPOSTO A PAGAR OU RECEBER: R$ ${impostoDevido.toFixed(2).replace('.', ',')}

🏠 BENS E VALORES
Total de bens: R$ ${valorBens.toFixed(2).replace('.', ',')}
            `.trim();

            textoArquivo = `PF|${dados.documento.replace(/\D/g, '')}|${dados.nome}|${dados.nascimento}|${dados.tipo_declaracao}|${anoBase}|${calculos.totalRendimentos}|${calculos.baseCalculo}|${calculos.impostoDevido}|${calculos.valorBens}`;

        } else {
            dados = {
                tipo: 'PESSOA JURÍDICA',
                nome: document.getElementById('razao_social').value.trim().toUpperCase(),
                nome_fantasia: document.getElementById('nome_fantasia').value.trim() || "Não informado",
                documento: document.getElementById('cnpj').value.trim(),
                tipo_empresa: document.getElementById('tipo_empresa').value.toUpperCase(),
                endereco: `${document.getElementById('rua').value}, Nº ${document.getElementById('numero').value} ${document.getElementById('complemento').value ? '- ' + document.getElementById('complemento').value : ''} - ${document.getElementById('bairro').value} - ${document.getElementById('cidade').value}/${document.getElementById('estado').value} - CEP: ${document.getElementById('cep').value}`,
                telefone: document.getElementById('telefone').value.trim() || "Não informado"
            };

            // CÁLCULOS PJ
            const receitaBruta = calcularValor(document.getElementById('receita_bruta').value);
            const outrasReceitas = calcularValor(document.getElementById('outras_receitas').value);
            const totalReceitas = receitaBruta + outrasReceitas;

            const custoMercadorias = calcularValor(document.getElementById('custo_mercadorias').value);
            const gastosFuncionarios = calcularValor(document.getElementById('gastos_funcionarios').value);
            const gastosOperacionais = calcularValor(document.getElementById('gastos_operacionais').value);
            const outrasDespesas = calcularValor(document.getElementById('outras_despesas').value);
            const totalDespesas = custoMercadorias + gastosFuncionarios + gastosOperacionais + outrasDespesas;

            const lucro = Math.max(totalReceitas - totalDespesas, 0);
            let aliquota = 0;

            if(dados.tipo_empresa === 'MEI') aliquota = 0.06;
            else if(dados.tipo_empresa === 'SIMPLES') aliquota = 0.08;
            else if(dados.tipo_empresa === 'PRESUMIDO') aliquota = 0.15;
            else if(dados.tipo_empresa === 'REAL') aliquota = 0.25;

            const impostoDevido = lucro * aliquota;
            const valorAtivos = calcularValor(document.getElementById('valor_ativos').value);
            const valorPassivos = calcularValor(document.getElementById('valor_passivos').value);
            const patrimonioLiquido = valorAtivos - valorPassivos;

            calculos = { totalReceitas, totalDespesas, lucro, aliquota, impostoDevido, valorAtivos, valorPassivos, patrimonioLiquido };

            // 📄 TEXTO DO RESUMO PJ
            textoResumo = `
🏢 DADOS DA EMPRESA
Razão Social: ${dados.nome}
Nome Fantasia: ${dados.nome_fantasia}
CNPJ: ${dados.documento}
Tipo de Empresa: ${dados.tipo_empresa}
Endereço: ${dados.endereco}
Telefone: ${dados.telefone}

💰 RECEITAS DO ANO
Vendas e serviços: R$ ${receitaBruta.toFixed(2).replace('.', ',')}
Outras receitas: R$ ${outrasReceitas.toFixed(2).replace('.', ',')}
TOTAL RECEBIDO: R$ ${totalReceitas.toFixed(2).replace('.', ',')}

💸 DESPESAS DO ANO
Mercadorias: R$ ${custoMercadorias.toFixed(2).replace('.', ',')}
Funcionários: R$ ${gastosFuncionarios.toFixed(2).replace('.', ',')}
Operacionais: R$ ${gastosOperacionais.toFixed(2).replace('.', ',')}
Outras despesas: R$ ${outrasDespesas.toFixed(2).replace('.', ',')}
TOTAL GASTO: R$ ${totalDespesas.toFixed(2).replace('.', ',')}

🧮 RESULTADO FINAL
Lucro obtido: R$ ${lucro.toFixed(2).replace('.', ',')}
Alíquota: ${(aliquota * 100).toFixed(0)}%
IMPOSTO A PAGAR: R$ ${impostoDevido.toFixed(2).replace('.', ',')}

🏢 VALORES DA EMPRESA
Bens e valores: R$ ${valorAtivos.toFixed(2).replace('.', ',')}
Dívidas: R$ ${valorPassivos.toFixed(2).replace('.', ',')}
Patrimônio líquido: R$ ${patrimonioLiquido.toFixed(2).replace('.', ',')}
            `.trim();

            textoArquivo = `PJ|${dados.documento.replace(/\D/g, '')}|${dados.nome}|${dados.tipo_empresa}|${anoBase}|${calculos.totalReceitas}|${calculos.totalDespesas}|${calculos.lucro}|${calculos.impostoDevido}`;
        }

        // SALVAR DADOS PARA USAR DEPOIS
        dadosSalvos = dados;
        calculosSalvos = calculos;

        // MOSTRAR RESUMO PARA CONFERÊNCIA
        conteudoResumo.innerHTML = `
            <div class="resumo-bloco">
                <pre style="background:rgba(0,0,0,0.3); padding:20px; border-radius:10px; color:#e0e7ff; font-size:15px; line-height:1.7; white-space:pre-wrap; border:1px solid rgba(255,255,255,0.1);">${textoResumo}</pre>
            </div>
        `;

        // ESCONDER FORMULÁRIO E MOSTRAR CONFERÊNCIA
        formulario.parentElement.style.display = 'none';
        areaConferencia.style.display = 'block';
        areaFinal.style.display = 'none';

        // ROLAR PARA O TOPO DA CONFERÊNCIA
        areaConferencia.scrollIntoView({ behavior: 'smooth' });
    });

    // ✏️ VOLTAR E EDITAR
    document.getElementById('voltar_editar').addEventListener('click', function() {
        areaConferencia.style.display = 'none';
        formulario.parentElement.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 📥 GERAR ARQUIVO FINAL
    document.getElementById('gerar_arquivo').addEventListener('click', function() {
        areaConferencia.style.display = 'none';

        areaFinal.innerHTML = `
            <div style="background:rgba(74, 222, 128, 0.1); padding:15px; border-radius:8px; margin-bottom:20px; border:1px solid rgba(74, 222, 128, 0.2);">
                <h3 style="color:#86efac; margin:0;">✅ Arquivo pronto para enviar à Receita Federal!</h3>
                <p style="margin:5px 0 0; color:#dcfce7;">Todos os dados conferidos e calculados corretamente</p>
            </div>

            <textarea readonly style="width:100%; height:220px; padding:12px; border:1px solid rgba(255,255,255,0.15); border-radius:5px; font-size:14px; background:rgba(0,0,0,0.3); color:#bfdbfe; margin-bottom:20px;">${textoArquivo}</textarea>

            <div style="display:flex; gap:15px; flex-wrap:wrap;">
                <button type="button" onclick="baixarArquivo('${textoArquivo.replace(/\n/g, '\\n')}', 'declaracao_ir_${anoBase}.txt')" class="botao-principal">📥 BAIXAR ARQUIVO OFICIAL</button>
                <button type="button" onclick="baixarArquivo('${conteudoResumo.innerText.replace(/\n/g, '\\n')}', 'resumo_conferencia_ir.txt')" class="botao-principal azul-claro">📄 BAIXAR RESUMO PARA GUARDAR</button>
            </div>

            <div style="margin-top:20px; padding:15px; background:rgba(251, 191, 36, 0.1); border-left:4px solid #fbbf24; border-radius:5px;">
                <strong style="color:#fde68a;">📌 Próximo passo:</strong> <span style="color:#fef3c7;">Acesse o sistema oficial da Receita Federal e importe esse arquivo — tudo já estará preenchido!</span>
            </div>
        `;

        areaFinal.style.display = 'block';
        areaFinal.scrollIntoView({ behavior: 'smooth' });
    });
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
