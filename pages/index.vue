<template>
    <div class="container mx-auto px-4">
        <Message severity="warn" class="m-4">

            <div class="text-center">
                Estes cálculos são feitos conforme interpretação do
                <a
class="text-blue-500 font-bold hover:underline"
                    href="https://sei.ifce.edu.br/sei/controlador_externo.php?acao=documento_conferir&codigo_verificador=7312739&codigo_crc=3CFEF38D&hash_download=e6e4e56bdaee0319554a3d88fa0ae2741c225425cc78d17b36d4034f1840b9a900e720fa42f39a8f4c986dec0b6173d42190cbea8b2fff8e21075d324c660c0c&visualizacao=1&id_orgao_acesso_externo=0">Ofício-Circular
                    nº 35/2025/GAB-PROGEP/PROGEP/REITORIA-IFCE</a>, podendo ser corrigido caso haja alguma
                divergência.
            </div>
            <div class="text-center">
                O autor não se responsabiliza por eventuais erros com a interpretação ou o cálculo.
            </div>

        </Message>
        <h1 class="text-2xl text-center">Calculadora de Progressão por Capacitação TAE</h1>
        <h2 class="text-xl mb-4 text-center text-muted">(Para progressões após 2025)</h2>

        <div class="flex flex-col gap-4">
            <Panel header="Entendimento utilizado para os cálculos:">
                <ul class="list-disc list-inside text-sm flex flex-col gap-2 ms-4">
                    <li>
                        Para utilizar qualquer saldo, o servidor deve ter completado pelo menos 12 meses de intersticio
                        em
                        01/01/2025.
                    </li>
                    <li>
                        Para simplificar o cálculo, o saldo é considerado a partir do dia de aniversário da progressão
                        em janeiro
                        de 2025. Tecnicamente, se o saldo fosse em dias e não em meses, bastaria considerar os dias
                        depois de 01/01/2025.
                    </li>
                    <li>
                        Para os casos em que o servidor não progrida em janeiro de 2025, o saldo é considerado a partir
                        da
                        data efetiva da última progressão, usando a nova regra de 12 meses.
                    </li>
                </ul>
            </Panel>
            <Panel
                :header="`Selecione a data efetiva da última progressão do servidor (entre ${minDate.toFormat('dd/MM/yyyy')} a 31/12/2024):`"
                class="text-center">
                <DatePicker
v-model="date" :min-date="minDate.toJSDate()" :max-date="maxDate.toJSDate()"
                    date-format="dd/mm/yy" placeholder="dd/mm/aaaa" />
            </Panel>
            <div v-if="calculos" class="flex flex-row gap-4">
                <div class="flex-1 flex flex-col gap-4">
                    <Panel header="Regra Antiga">

                        <div class="mb-2">Próxima progressão: {{ calculos.old.proxProgressao }}</div>
                        <div class="mb-2">Interstício: {{ calculos.old.intersticio[0] }} a {{
                            calculos.old.intersticio[1] }} (18 meses)</div>

                    </Panel>
                    <Panel header="Regra Nova">

                        <div class="mb-2">Data Aniversário em Janeiro/2025: {{ calculos.new.aniversarioJan2025 }}
                        </div>
                        <div class="mb-2">Tempo acumulado até a data de aniversário: {{
                            calculos.new.saldoNoAniversario }} meses
                        </div>
                        <div class="mb-2">Progride no aniversário: {{ calculos.new.progrideNoAniversario ? 'Sim' :
                            'Não' }}
                        </div>
                        <div class="mb-2">Saldo restante: {{ calculos.new.saldoRestante }} meses</div>
                        <div class="mb-2">Meses para próxima progressão: {{ calculos.new.mesesParaProxProgressao }}
                            meses</div>
                    </Panel>
                </div>

                <Panel header="Próximas progressões">
                    <DataView :value="calculos.progressoes">
                        <template #list="slotProps">
                            <div class="flex flex-col gap-2">
                                <Panel v-for="(item) in slotProps.items" :key="item.data" :header="item.data">
                                        <div>
                                            Interstício: {{ item.intersticio[0] }} a {{ item.intersticio[1] }}
                                        </div>
                                        <div v-if="item.notas" class="text-sm text-muted">
                                            {{ item.notas }}
                                        </div>
                                </Panel>
                            </div>
                        </template>
                    </DataView>

                </Panel>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

type Progressao = {
    data: DateTime
    intersticio: [DateTime, DateTime]
    notas?: string
}

const maxDate = DateTime.fromObject({ year: 2025, month: 1, day: 1 }).minus({ days: 1 })
const minDate = maxDate.minus({ months: 18 })
const date = ref<Date | null>(DateTime.fromObject({ year: 2023, month: 7, day: 4 }).toJSDate())
const calculos = computed(() => {
    if (!date.value) return null
    const proxProgressaoOld = DateTime.fromJSDate(date.value).plus({ months: 18 })
    const intersticioStartOld = DateTime.fromJSDate(date.value)
    const intersticioEndOld = proxProgressaoOld.minus({ days: 1 })
    const aniversarioJan2025 = DateTime.fromObject({ year: 2025, month: 1, day: intersticioStartOld.day })
    const saldoNoAniversario = aniversarioJan2025.diff(intersticioStartOld, 'months').months
    let saldoRestante = saldoNoAniversario - 12
    const progrideNoAniversario = saldoRestante >= 0
    if (saldoRestante < 0) {
        saldoRestante = 0
    }
    const mesesParaProxProgressao = 12 - saldoRestante
    const proxProgressaoUsandoSaldo = aniversarioJan2025.plus({ months: mesesParaProxProgressao })
    const progressoes: Progressao[] = []
    if (progrideNoAniversario) {
        progressoes.push({
            data: aniversarioJan2025,
            intersticio: [intersticioStartOld, aniversarioJan2025.minus({ days: 1 })],
            notas: `Aniversario em Janeiro/2025 (saldo de ${saldoNoAniversario} meses)`
        })
    }
    if (mesesParaProxProgressao < 12) {
        progressoes.push({
            data: proxProgressaoUsandoSaldo,
            intersticio: [aniversarioJan2025, proxProgressaoUsandoSaldo.minus({ days: 1 })],
            notas: `Próxima progressão usando saldo (saldo de ${saldoRestante} meses)`
        })
    }
    if (progressoes.length === 0) {
        const data = intersticioStartOld.plus({ months: 12 })
        progressoes.push({
            data,
            intersticio: [intersticioStartOld, data.minus({ days: 1 })],
        })
    }
    const moreProgressao = 6 - progressoes.length
    for (let i = 0; i < moreProgressao; i++) {
        const anterior = progressoes[progressoes.length - 1].data
        const data = anterior.plus({ months: 12 })
        progressoes.push({
            data: data,
            intersticio: [anterior, data.minus({ days: 1 })],
        })
    }
    return {
        old: {
            proxProgressao: proxProgressaoOld.toFormat('dd/MM/yyyy'),
            intersticio: [intersticioStartOld.toFormat('dd/MM/yyyy'), intersticioEndOld.toFormat('dd/MM/yyyy')],


        },
        new: {
            aniversarioJan2025: aniversarioJan2025.toFormat('dd/MM/yyyy'),
            saldoNoAniversario: saldoNoAniversario,
            saldoRestante: saldoRestante,
            mesesParaProxProgressao: mesesParaProxProgressao,
            progrideNoAniversario: progrideNoAniversario,
        },
        progressoes: progressoes.map((p) => {
            return {
                data: p.data.toFormat('dd/MM/yyyy'),
                intersticio: [p.intersticio[0].toFormat('dd/MM/yyyy'), p.intersticio[1].toFormat('dd/MM/yyyy')],
                notas: p.notas
            }
        })
    }
})
</script>