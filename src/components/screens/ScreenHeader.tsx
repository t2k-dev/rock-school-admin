import React, { ReactNode } from "react";
import { Colors } from "../../constants/Colors";
import { EditIcon } from "../icons";

interface ScreenHeaderProps {
  avatar?: ReactNode;
  title: string;
  subtitle?: string | ReactNode;
  meta?: ReactNode;
  aside?: ReactNode;
  asideClassName?: string;
  onEdit?: (e: React.MouseEvent) => void;
  titleClassName?: string;
  className?: string;
  children?: ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  avatar,
  title,
  subtitle,
  meta,
  aside,
  asideClassName = "",
  onEdit,
  titleClassName = "text-[28px]",
  className = "",
  children,
}) => {
  const headerStyle = {
    "--screen-header-bg": Colors.cardBg,
    "--screen-header-title": Colors.textMain,
    "--screen-header-subtitle": Colors.textMuted,
  } as React.CSSProperties;

  return (
    <div
      className={[
        "flex flex-col gap-5 rounded-2xl bg-[var(--screen-header-bg)] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.16)]",
        "md:flex-row md:items-start md:justify-between",
        className,
      ].join(" ")}
      style={headerStyle}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div
          className={[
            "flex min-w-0 flex-col gap-4 md:flex-row md:items-start",
            children ? "md:basis-2/5 md:pr-4 md:shrink" : "flex-1",
          ].join(" ")}
        >
          <div className="flex h-[100px] w-[100px] items-center justify-center">
            {avatar}
          </div>
          <div className="min-w-0 flex-1 md:ml-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className={[
                  "m-0 font-bold leading-tight text-[var(--screen-header-title)]",
                  titleClassName,
                ].join(" ")}
              >
                {title}
              </h2>
              {onEdit ? <EditIcon onIconClick={onEdit} /> : null}
            </div>

            {subtitle ? (
              <div className="mt-2 text-sm text-[var(--screen-header-subtitle)]">
                {subtitle}
              </div>
            ) : null}

            {meta ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {meta}
              </div>
            ) : null}
          </div>
        </div>

        {children ? (
          <div className="min-w-0 md:basis-3/5 md:self-stretch md:pl-2">
            {children}
          </div>
        ) : null}
      </div>

      {aside ? (
        <div className={["min-w-0 md:min-w-[220px]", asideClassName].join(" ")}>
          {aside}
        </div>
      ) : null}
    </div>
  );
};

export default ScreenHeader;
