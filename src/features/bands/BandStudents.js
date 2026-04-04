import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import { Button, FormLabel } from "../../components/ui";
import { getDisciplineName } from "../../constants/disciplines";
import { calculateAge } from "../../utils/dateTime";
import { DisciplineGridSelector } from "../disciplines/DisciplineGridSelector";
import { DisciplineIcon } from "../disciplines/DisciplineIcon";

export const BandStudents = ({
  bandMembers = [],
  onAddStudent,
  onDeleteStudent,
  onRoleChange,
  showLabel = false,
}) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const getRoleId = (member) => member.roleId ?? member.bandRoleId ?? null;

  const handleOpenModal = (index) => {
    setSelectedIndex(index);
    setShowRoleModal(true);
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
    setSelectedIndex(null);
  };

  const handleSelectRole = (disciplineId) => {
    if (onRoleChange && selectedIndex !== null) {
      onRoleChange(selectedIndex, disciplineId);
    }
    handleCloseModal();
  };

  const selectedMember =
    selectedIndex !== null ? bandMembers[selectedIndex] : null;

  return (
    <>
      <div className="flex flex-col gap-4">
        {showLabel && <FormLabel as="div">Участники</FormLabel>}

        {bandMembers.length > 0 ? (
          <div className="flex flex-col gap-3">
            {bandMembers.map((member, index) => {
              const age = calculateAge(member.birthDate);
              const roleId = getRoleId(member);

              return (
                <div
                  key={index}
                  className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4 rounded-[20px] border border-white/10 bg-inner-bg px-4 py-3 shadow-sm"
                >
                  <div className="flex justify-center">
                    <Avatar style={{ width: "36px", height: "36px" }} />
                  </div>

                  <div className="min-w-0">
                    <Link
                      to={`/student/${member.studentId}`}
                      className="block truncate text-[16px] font-semibold text-text-main no-underline transition hover:text-white"
                      style={{ background: "transparent", boxShadow: "none" }}
                    >
                      {member.firstName} {member.lastName}
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-text-muted">
                      <span>{age} лет</span>
                      <span className="opacity-40">•</span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[13px] text-text-muted transition hover:border-white/20 hover:text-text-main"
                        onClick={() => handleOpenModal(index)}
                        style={{
                          background: "transparent",
                          boxShadow: "none",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {roleId ? (
                          <>
                            <span>{getDisciplineName(roleId)}</span>
                            <DisciplineIcon disciplineId={roleId} size="18px" />
                          </>
                        ) : (
                          <span>Выбрать роль</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    variant="outlineDanger"
                    size="sm"
                    onClick={() => onDeleteStudent(index)}
                    style={{ background: "transparent", boxShadow: "none" }}
                  >
                    X
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[20px] border border-white/10 bg-inner-bg px-4 py-6 text-center text-[14px] text-text-muted border-dashed">
            Участники не добавлены
          </div>
        )}

        <div className="text-center">
          <Button
            variant="primary"
            size="sm"
            onClick={onAddStudent}
            style={{ boxShadow: "none" }}
          >
            + Добавить
          </Button>
        </div>
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6 transition-all">
          <div className="w-full max-w-4xl rounded-[28px] border border-white/10 bg-card-bg p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <div className="text-[24px] font-semibold text-text-main tracking-tight">
                  Выберите роль ученика
                </div>
                {selectedMember && (
                  <div className="mt-2 text-[14px] text-text-muted opacity-80 uppercase tracking-wider">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[14px] text-text-muted transition hover:bg-white/10 hover:text-text-main active:scale-95"
                style={{ background: "transparent", boxShadow: "none" }}
              >
                Закрыть
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <DisciplineGridSelector
                selectedDisciplineId={
                  selectedMember ? getRoleId(selectedMember) : null
                }
                onDisciplineChange={handleSelectRole}
                multiSelect={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
