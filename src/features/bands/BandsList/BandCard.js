import { Link } from "react-router-dom";
import { GroupIcon } from "../../../components/icons";
import { HoverCard } from "../../../components/ui";

const BandCard = ({ item }) => {
  const { bandId, name, teacher, studentsCount, isActive } = item;

  return (
    <HoverCard
      as={Link}
      to={`/band/${bandId}`}
      className="mb-2 grid grid-cols-[48px_minmax(0,1fr)] items-center gap-4 no-underline text-inherit"
    >
      <div>
        <GroupIcon size="40px" />
      </div>
      <div className="grid items-center gap-3 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)_auto]">
        <div>
          <h3 className="mb-1 text-xl font-semibold">{name}</h3>
        </div>
        <div>
          <div className="text-sm text-slate-400">Куратор</div>
          <div>{teacher ? `${teacher.firstName} ${teacher.lastName}` : "-"}</div>
        </div>
        <div className="flex items-center justify-start gap-3 md:justify-end">
          {/*<div className="text-sm text-slate-400">Участников</div>
          <div>{studentsCount}</div>*/}
        </div>
      </div>
    </HoverCard>
  );
};

export default BandCard;