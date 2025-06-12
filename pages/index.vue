<template>
  <div class="container mx-auto px-2 sm:px-4 py-6">
    <Message
      severity="warn"
      class="mb-4 rounded-lg shadow-md flex flex-col items-center"
    >
      <div class="mb-0">
        Os cálculos apresentados baseiam-se no
        <a
          class="text-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          href="https://sei.ifce.edu.br/sei/controlador_externo.php?acao=documento_conferir&codigo_verificador=7312739&codigo_crc=3CFEF38D&hash_download=e6e4e56bdaee0319554a3d88fa0ae2741c225425cc78d17b36d4034f1840b9a900e720fa42f39a8f4c986dec0b6173d42190cbea8b2fff8e21075d324c660c0c&visualizacao=1&id_orgao_acesso_externo=0"
          target="_blank"
          rel="noopener"
          >Ofício-Circular nº 35/2025/GAB-PROGEP/PROGEP/REITORIA-IFCE</a
        >
        e de esclarecimentos adicionais da PROGEP.
      </div>
      <div class="text-center mb-2">
        Caso haja divergências, os resultados poderão ser ajustados.
      </div>
      <div class="text-center mb-2">
        Sempre fique atento às orientações oficiais da PROGEP e quaisquer novas
        diretrizes emitidas.
      </div>
    </Message>

    <div class="flex flex-col gap-6">
      <Panel
        header="Critérios considerados nos cálculos (atualizado em 12/06/2025):"
        class="shadow-sm rounded-lg"
      >
        <ul class="list-disc list-inside text-sm flex flex-col gap-2 ms-4">
          <li>
            Se o servidor teve a última progressão entre 01/07/2023 e
            31/12/2023, e interstício de 18 meses completado a partir de
            01/01/2025, a nova regra estabelece que será considerado o
            interstício de 12 meses.
          </li>
          <li>
            Neste caso, a data da nova progressão será calculada com base no dia
            exato em que o servidor completar 12 meses de interstício, a partir
            da última progressão por mérito.
          </li>
          <li>
            Os efeitos financeiros nesses casos serão retroativos até
            01/01/2025.
          </li>
          <li>
            Se o servidor teve a última progressão entre 01/01/2024 e
            31/12/2024, a nova regra estabelece que será considerado o
            interstício de 12 meses.
          </li>
          <li>
            A progressão onde acontece a transição para a nova regra ficará demarcada.
          </li>
          <li>
            O sistema ainda calcula progressões anteriores e posteriores à
            transição, a fim de auxiliar nos cálculos de progressões pendentes e
            futuras.
          </li>
          <li class="font-bold">
            É importante notar que existem afastamentos que suspendem o efetivo
            exercício, o que pode impactar no cálculo do interstício e,
            consequentemente, na data da progressão.
          </li>
        </ul>
      </Panel>
      <Panel
        :header="`Informe a data efetiva da última progressão do servidor:`"
        class="text-center shadow-sm rounded-lg"
      >
        <div class="flex justify-center">
          <DatePicker
            v-model="date"
            :min-date="MIN_DATE.toJSDate()"
            :max-date="TODAY.toJSDate()"
            date-format="dd/mm/yy"
            placeholder="dd/mm/aaaa"
            class="w-full max-w-xs"
          />
        </div>
      </Panel>
      <div v-if="calculos" class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1 flex flex-col gap-6">
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
                    <div :class="{ 'bg-green-200 dark:bg-green-800 p-2 rounded-lg': calculos.intersticioTransicao === item }">
                      <div class="font-bold">
                        {{ item.data.toFormat("dd/MM/yyyy") }}
                      </div>
                      <div class="mb-1">
                        <span class="font-semibold">Interstício: </span>
                        <span class="">
                          {{ item.start.toFormat("dd/MM/yyyy") }} a
                          {{ item.end.toFormat("dd/MM/yyyy") }}</span
                        >
                      </div>
                      <div v-if="item.isNovaRegra" class="text-xs italic">
                        (Regra Nova - 12 meses)
                      </div>
                      <div v-else class="text-xs italic">
                        (Regra Antiga - 18 meses)
                      </div>
                      <div v-if="item.note" class="text-sm font-bold">
                        {{ item.note }}
                      </div>
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
  </div>
</template>

<script setup lang="ts">
import { DateTime } from "luxon";

// const dataTeste = DateTime.fromObject({
//   year: 2011,
//   month: 7,
//   day: 4,
// }).toJSDate();
//const date = ref<Date | null>(dataTeste);
const date = ref<Date | null>(null);
const calculos = computed(() => {
  if (!date.value) return null;
  const lastProgressao = DateTime.fromJSDate(date.value);
  return calcularProgressoes(lastProgressao);
});
</script>
