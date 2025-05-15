<template>
  <div class="container mx-auto px-2 sm:px-4 py-6">
    <Message
      severity="warn"
      class="mb-4 rounded-lg shadow-md flex flex-col items-center"
    >
      <div class="mb-0">
        Os cálculos apresentados seguem interpretação do
        <a
          class="text-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          href="https://sei.ifce.edu.br/sei/controlador_externo.php?acao=documento_conferir&codigo_verificador=7312739&codigo_crc=3CFEF38D&hash_download=e6e4e56bdaee0319554a3d88fa0ae2741c225425cc78d17b36d4034f1840b9a900e720fa42f39a8f4c986dec0b6173d42190cbea8b2fff8e21075d324c660c0c&visualizacao=1&id_orgao_acesso_externo=0"
          target="_blank"
          rel="noopener"
          >Ofício-Circular nº 35/2025/GAB-PROGEP/PROGEP/REITORIA-IFCE</a
        >.
      </div>
      <div class="text-center mb-2">
        Caso haja divergências, os resultados poderão ser ajustados.
      </div>
      <div class="text-center text-xs">
        O autor não se responsabiliza por eventuais equívocos de interpretação
        ou cálculo.
      </div>
    </Message>

    <div class="flex flex-col gap-6">
      <Panel
        header="Critérios considerados nos cálculos:"
        class="shadow-sm rounded-lg"
      >
        <ul class="list-disc list-inside text-sm flex flex-col gap-2 ms-4">
          <li>
            Para utilizar qualquer saldo, o servidor deve ter completado pelo
            menos 12 meses de interstício até 01/01/2025.
          </li>
          <li>
            Para simplificação, o saldo é contado a partir do dia do aniversário
            da progressão em janeiro de 2025. Caso o saldo fosse em dias,
            considerar-se-iam apenas os dias após 01/01/2025.
          </li>
          <li>
            Se o servidor não progredir em janeiro de 2025, o saldo passa a ser
            contado a partir da data efetiva da última progressão, já sob a nova
            regra de 12 meses.
          </li>
        </ul>
      </Panel>
      <Panel
        :header="`Informe a data efetiva da última progressão do servidor (entre ${minDate.toFormat('dd/MM/yyyy')} e 31/12/2024):`"
        class="text-center shadow-sm rounded-lg"
      >
        <div class="flex justify-center">
          <DatePicker
            v-model="date"
            :min-date="minDate.toJSDate()"
            :max-date="maxDate.toJSDate()"
            date-format="dd/mm/yy"
            placeholder="dd/mm/aaaa"
            class="w-full max-w-xs"
          />
        </div>
      </Panel>
      <div v-if="calculos" class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1 flex flex-col gap-6">
          <Panel header="Regra Anterior" class="rounded-lg shadow">
            <div class="mb-2 flex flex-col gap-1">
              <span class="font-semibold">Próxima progressão:</span>
              <Chip class="">{{ calculos.old.proxProgressao }}</Chip>
            </div>
            <div class="mb-2 flex flex-col gap-1">
              <span class="font-semibold">Interstício:</span>
              <Chip class=""
                >{{ calculos.old.intersticio[0] }} a
                {{ calculos.old.intersticio[1] }}
                <span class="text-xs">(18 meses)</span></Chip
              >
            </div>
          </Panel>
          <Panel header="Nova Regra" class="rounded-lg shadow">
            <div class="mb-2 flex flex-col gap-1">
              <span class="font-semibold"
                >Data de aniversário em janeiro/2025:</span
              >
              <Chip class="">{{ calculos.new.aniversarioJan2025 }}</Chip>
            </div>
            <div class="mb-2 flex flex-col gap-1">
              <span class="font-semibold"
                >Tempo acumulado até o aniversário:</span
              >
              <Chip class="">{{ calculos.new.saldoNoAniversario }} meses</Chip>
            </div>
            <div class="mb-2 flex flex-col gap-1">
              <span class="font-semibold">Progride no aniversário:</span>
              <Chip
                ><span
                  :class="
                    calculos.new.progrideNoAniversario
                      ? 'text-green-600 font-bold'
                      : 'text-red-600 font-bold'
                  "
                >
                  {{ calculos.new.progrideNoAniversario ? "Sim" : "Não" }}
                </span>
              </Chip>
            </div>
            <div class="mb-2 flex flex-col gap-1">
              <span class="font-semibold">Saldo remanescente:</span>
              <Chip class="">{{ calculos.new.saldoRestante }} meses</Chip>
            </div>
            <div class="mb-2 flex flex-col gap-1">
              <span class="font-semibold">Meses até a próxima progressão:</span>
              <Chip class=""
                >{{ calculos.new.mesesParaProxProgressao }} meses</Chip
              >
            </div>
          </Panel>
        </div>

        <Panel header="Próximas progressões" class="flex-1 rounded-lg shadow">
          <DataView :value="calculos.progressoes">
            <template #list="slotProps">
              <div class="flex flex-col gap-0">
                <div
                  v-for="(item, index) in slotProps.items"
                  :key="item.data"
                  class="text-center"
                >
                  <Divider v-if="index > 0" />
                  <div class="font-bold">{{ item.data }}</div>
                  <div class="mb-1">
                    <span class="font-semibold">Interstício: </span>
                    <span class="">
                      {{ item.intersticio[0] }} a
                      {{ item.intersticio[1] }}</span
                    >
                  </div>
                  <div v-if="item.notas" class="text-xs italic">
                    {{ item.notas }}
                  </div>
                </div>
                <div>
                  <Divider />
                  <div class="text-3xs text-center">. . .</div>
                </div>
              </div>
            </template>
          </DataView>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from "luxon";

type Progressao = {
  data: DateTime;
  intersticio: [DateTime, DateTime];
  notas?: string;
};

const maxDate = DateTime.fromObject({ year: 2025, month: 1, day: 1 }).minus({
  days: 1,
});
const minDate = maxDate.minus({ months: 18 });
//const dataTeste = DateTime.fromObject({ year: 2023, month: 7, day: 4 }).toJSDate()
const date = ref<Date | null>(null);
const calculos = computed(() => {
  if (!date.value) return null;
  const proxProgressaoOld = DateTime.fromJSDate(date.value).plus({
    months: 18,
  });
  const intersticioStartOld = DateTime.fromJSDate(date.value);
  const intersticioEndOld = proxProgressaoOld.minus({ days: 1 });
  const aniversarioJan2025 = DateTime.fromObject({
    year: 2025,
    month: 1,
    day: intersticioStartOld.day,
  });
  const saldoNoAniversario = aniversarioJan2025.diff(
    intersticioStartOld,
    "months",
  ).months;
  let saldoRestante = saldoNoAniversario - 12;
  const progrideNoAniversario = saldoRestante >= 0;
  if (saldoRestante < 0) {
    saldoRestante = 0;
  }
  const mesesParaProxProgressao = 12 - saldoRestante;
  const proxProgressaoUsandoSaldo = aniversarioJan2025.plus({
    months: mesesParaProxProgressao,
  });
  const progressoes: Progressao[] = [];
  if (progrideNoAniversario) {
    progressoes.push({
      data: aniversarioJan2025,
      intersticio: [intersticioStartOld, aniversarioJan2025.minus({ days: 1 })],
      notas: `Aniversario em Janeiro/2025 (saldo de ${saldoNoAniversario} meses)`,
    });
  }
  if (mesesParaProxProgressao < 12) {
    progressoes.push({
      data: proxProgressaoUsandoSaldo,
      intersticio: [
        aniversarioJan2025,
        proxProgressaoUsandoSaldo.minus({ days: 1 }),
      ],
      notas: `usando saldo de ${saldoRestante} meses`,
    });
  }
  if (progressoes.length === 0) {
    const data = intersticioStartOld.plus({ months: 12 });
    progressoes.push({
      data,
      intersticio: [intersticioStartOld, data.minus({ days: 1 })],
    });
  }
  const moreProgressao = 6 - progressoes.length;
  for (let i = 0; i < moreProgressao; i++) {
    const anterior = progressoes[progressoes.length - 1].data;
    const data = anterior.plus({ months: 12 });
    progressoes.push({
      data: data,
      intersticio: [anterior, data.minus({ days: 1 })],
    });
  }
  return {
    old: {
      proxProgressao: proxProgressaoOld.toFormat("dd/MM/yyyy"),
      intersticio: [
        intersticioStartOld.toFormat("dd/MM/yyyy"),
        intersticioEndOld.toFormat("dd/MM/yyyy"),
      ],
    },
    new: {
      aniversarioJan2025: aniversarioJan2025.toFormat("dd/MM/yyyy"),
      saldoNoAniversario: saldoNoAniversario,
      saldoRestante: saldoRestante,
      mesesParaProxProgressao: mesesParaProxProgressao,
      progrideNoAniversario: progrideNoAniversario,
    },
    progressoes: progressoes.map((p) => {
      return {
        data: p.data.toFormat("dd/MM/yyyy"),
        intersticio: [
          p.intersticio[0].toFormat("dd/MM/yyyy"),
          p.intersticio[1].toFormat("dd/MM/yyyy"),
        ],
        notas: p.notas,
      };
    }),
  };
});
</script>
