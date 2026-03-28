import {
  ViolaIcon,
  GuitarIcon,
  BassGuitarIcon,
  ElectroGuitarIcon,
  DrumsIcon,
  PianoIcon,
  VocalIcon,
  UkuleleIcon,
} from "../../../../components/icons";

interface InstrumentIcon {
  id: number;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const attendanceCounts = [
  { value: "1", label: "1" },
  { value: "4", label: "4" },
  { value: "8", label: "8" },
  { value: "12", label: "12" },
  { value: "16", label: "16" },
  { value: "20", label: "20" },
  { value: "24", label: "24" },
];

export const attendanceLengths = [
  { value: "1", label: "Час" },
  { value: "2", label: "Полтора часа" },
];

export const Instruments: InstrumentIcon[] = [
  {
    id: 1,
    name: "Скрипка",
    icon: ViolaIcon,
  },
  {
    id: 2,
    name: "Гитара",
    icon: GuitarIcon,
  },
  {
    id: 3,
    name: "Бас-гитара",
    icon: BassGuitarIcon,
  },
  {
    id: 4,
    name: "Электрогитара",
    icon: ElectroGuitarIcon,
  },
  {
    id: 5,
    name: "Барабаны",
    icon: DrumsIcon,
  },
  {
    id: 6,
    name: "Фортепиано",
    icon: PianoIcon,
  },
  {
    id: 7,
    name: "Акустическая гитара",
    icon: GuitarIcon,
  },
  {
    id: 8,
    name: "Вокал",
    icon: VocalIcon,
  },
  {
    id: 9,
    name: "Укулеле",
    icon: UkuleleIcon,
  },
];
