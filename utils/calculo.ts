import { Duration, DateTime } from "luxon";

const NOVA_REGRA_SALDO_END_DATE = DateTime.fromObject({
    year: 2023,
    month: 12,
    day: 31,
})


const NOVA_REGRA_START_DATE = DateTime.fromObject({
    year: 2023,
    month: 7,
    day: 1,
})

const JAN_2025 = DateTime.fromObject({
    year: 2025,
    month: 1,
    day: 1,
})

export const MIN_DATE = JAN_2025.minus({ months: 18 * 18 });
export const TODAY = DateTime.now();


export type Intersticio = {
    data: DateTime;
    start: DateTime;
    end: DateTime;
    note: string;
    isNovaRegra: boolean;
}

export function calcularProximaProgressaoNovaRegra(dataUltimaProgressao: DateTime): DateTime {
  const intersticio = Duration.fromObject({ months: 12 });
  return dataUltimaProgressao.plus(intersticio);
}

export function calcularProximaProgressaoAntigaRegra(dataUltimaProgressao: DateTime): DateTime {
  const intersticio = Duration.fromObject({ months: 18 });
  return dataUltimaProgressao.plus(intersticio);
}

export function calcularProximaProgressao(dataUltimaProgressao: DateTime): DateTime {
  if (isNovaRegra(dataUltimaProgressao)) {
    return calcularProximaProgressaoNovaRegra(dataUltimaProgressao);
  } else {
    return calcularProximaProgressaoAntigaRegra(dataUltimaProgressao);
  }
}

export function isNovaRegra(dataUltimaProgressao: DateTime): boolean {
  if (dataUltimaProgressao >= NOVA_REGRA_START_DATE) {
    return true
  }
  return false;
}

export function createIntersticio(start: DateTime, note: string = ""): Intersticio {
    const novaRegra = isNovaRegra(start);
    const data = calcularProximaProgressao(start) 
    const end = data.minus({ days: 1 });
    
    return {
        data,
        start,
        end,
        note,
        isNovaRegra: novaRegra,       
    }
}

export type progressoesCalculadas = {
    start: DateTime;
    progressoes: Intersticio[];
    intersticioTransicao: Intersticio | null;
}


export function calcularProgressoes(start: DateTime): progressoesCalculadas {
    const MAX_PROGRESSOES = 18;
    const EXTRA_PROGRESSOES = 2;
    let novaData = start;
    const progressoes: Intersticio[] = [];
    let intersticioTransicao: Intersticio|null = null;
    while (!isNovaRegra(novaData) && progressoes.length < MAX_PROGRESSOES) {
        progressoes.push(createIntersticio(novaData));
        novaData = calcularProximaProgressao(novaData);
    }
    let extra = 0;
    while (progressoes.length < MAX_PROGRESSOES) {
        const intersticio = createIntersticio(novaData);
        if (novaData <= NOVA_REGRA_SALDO_END_DATE) {
            intersticio.note = "Efeitos financeiros retroativos até 01/01/2025"
        }
        if (novaData >= NOVA_REGRA_START_DATE && novaData < JAN_2025 && intersticioTransicao === null) {
            intersticioTransicao = intersticio;
        }
        progressoes.push(intersticio);
        novaData = calcularProximaProgressao(novaData);
        if (novaData >= TODAY) {
            if (extra < EXTRA_PROGRESSOES) {
                extra++;
            } else {
                break;
            }
        }
    }
    console.log("Progressoes calculadas: %d", progressoes.length);
    return {
        start,
        progressoes,
        intersticioTransicao
    }
}