class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: ['macaco'], ocupacao: 3 },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [], ocupacao: 0 },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: ['gazela'], ocupacao: 1 },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [], ocupacao: 0 },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: ['leao'], ocupacao: 1 }
        ];

        this.animais = {
            'LEAO': { tamanho: 3, bioma: ['savana'] },
            'LEOPARDO': { tamanho: 2, bioma: ['savana'] },
            'CROCODILO': { tamanho: 3, bioma: ['rio'] },
            'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'] },
            'GAZELA': { tamanho: 2, bioma: ['savana'] },
            'HIPOPOTAMO': { tamanho: 4, bioma: ['savana e rio', 'savana', 'rio'] }
        };
    }

    analisaRecintos(animal, quantidade) {
        // Regra de entrada 1: O programa deve receber tipo e quantidade de animal (nessa ordem)
        if (!this.animais[animal]) {
            // Regra de saída 4: Caso animal informado seja inválido, apresentar erro "Animal inválido"
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            // Regra de saída 5: Caso quantidade informada seja inválida, apresentar erro "Quantidade inválida"
            return { erro: "Quantidade inválida" };
        }

        const dadosAnimal = this.animais[animal];
        const tamanhoNecessario = dadosAnimal.tamanho * quantidade;

        const recintosViaveis = this.recintos
            .filter(recinto => {
                // Regra 1: Um animal se sente confortável se está num bioma adequado e com espaço suficiente para cada indivíduo
                return dadosAnimal.bioma.includes(recinto.bioma) &&
                    this.verificaCompatibilidade(recinto, animal) &&
                    this.podeAcomodarLote(recinto, quantidade, dadosAnimal.tamanho);
            })
            .map(recinto => {
                // Regra 6: Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
                const espacoExtra = (recinto.animais.length > 0 && recinto.animais[0] !== animal) ? 1 : 0;
                const espacoOcupado = recinto.ocupacao + (dadosAnimal.tamanho * quantidade) + espacoExtra;
                const espacoLivre = recinto.tamanho - espacoOcupado;

                return {
                    numero: recinto.numero,
                    espacoLivre: espacoLivre,
                    tamanhoTotal: recinto.tamanho
                };
            })
            .filter(r => r.espacoLivre >= 0) 
            .sort((a, b) => a.numero - b.numero);

        if (recintosViaveis.length === 0) {
            // Regra de saída 6: Caso não haja recinto possível, apresentar erro "Não há recinto viável"
            return { erro: "Não há recinto viável" };
        }

        // Regra de saída 3: A lista de recintos viáveis deve indicar o espaço livre que restaria após a inclusão do(s) animal(is) e o espaço total
        return {
            recintosViaveis: recintosViaveis.map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.tamanhoTotal})`)
        };
    }

    verificaCompatibilidade(recinto, novoAnimal) {
        const carnivoros = ['LEAO', 'LEOPARDO', 'CROCODILO'];
        const dadosNovoAnimal = this.animais[novoAnimal];

        // Regra 2: Animais carnívoros devem habitar somente com a própria espécie
        if (carnivoros.includes(novoAnimal)) {
            return recinto.animais.length === 0 || recinto.animais.every(animalExistente => animalExistente === novoAnimal);
        }

        // Regra 4: Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
        if (novoAnimal === 'HIPOPOTAMO' && !recinto.bioma.includes('savana e rio')) {
            return false;
        }

        // Regra 5: Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
        if (novoAnimal === 'MACACO' && recinto.animais.length === 0) {
            return false;
        }

        // Regra 3: Animais já presentes no recinto devem continuar confortáveis com a inclusão do(s) novo(s)
        return true;
    }

    podeAcomodarLote(recinto, quantidade, tamanhoAnimal) {
        // Regra 7: Não é possível separar os lotes de animais nem trocar os animais que já existem de recinto (eles são muito apegados!)
        const espacoNecessario = tamanhoAnimal * quantidade;
        const espacoExtra = (recinto.animais.length > 0 && recinto.animais[0] !== 'MACACO') ? 1 : 0;
        const espacoOcupado = recinto.ocupacao + espacoNecessario + espacoExtra;

        return (recinto.tamanho - espacoOcupado) >= 0;
    }
}

export { RecintosZoo as RecintosZoo };

console.log(new RecintosZoo().analisaRecintos('HIPOPOTAMO', 2)) // Um breve teste de saída - Não há recinto viável

