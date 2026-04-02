import { FC } from "react";
import {
  BranchesIcon,
  StudentIcon,
  MusicalGroupIcon,
  TeacherIcon,
  CoinsBarIcon,
} from "../../../components/icons";

interface NavLink {
  name: string;
  path: string;
  icon?: FC<any>;
}

export const NAV_LINKS: NavLink[] = [
  {
    name: "Филиалы",
    icon: BranchesIcon,
    path: "/home",
  },
  {
    name: "Преподаватели",
    icon: TeacherIcon,
    path: "/teachers",
  },
  {
    name: "Ученики",
    icon: StudentIcon,
    path: "/students",
  },
  {
    name: "Группы",
    icon: MusicalGroupIcon,
    path: "/bands",
  },
  {
    name: "Тарифы",
    icon: CoinsBarIcon,
    path: "/tariffList",
  },
];
