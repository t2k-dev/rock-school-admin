import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import { Button, FormLabel } from "../../components/ui";
import { getDisciplineName } from "../../constants/disciplines";
import { calculateAge } from "../../utils/dateTime";
import { DisciplineGridSelector } from "../disciplines/DisciplineGridSelector";
import { DisciplineIcon } from "../disciplines/DisciplineIcon";

export class BandStudents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRoleModal: false,
      selectedStudentIndex: null,
    };
  }

  handleShowRoleModal = (studentIndex) => {
    this.setState({
      showRoleModal: true,
      selectedStudentIndex: studentIndex,
    });
  };

  handleCloseRoleModal = () => {
    this.setState({
      showRoleModal: false,
      selectedStudentIndex: null,
    });
  };

  handleRoleSelect = (disciplineId) => {
    const { selectedStudentIndex } = this.state;
    const { onRoleChange } = this.props;
    
    if (onRoleChange && selectedStudentIndex !== null) {
      onRoleChange(selectedStudentIndex, disciplineId);
    }
    
    this.handleCloseRoleModal();
  };

  getRoleId = (bandMember) => {
    return bandMember.roleId ?? bandMember.bandRoleId ?? null;
  };

  renderStudent = (bandMember, index) => {
    const age = calculateAge(bandMember.birthDate);
    const { onDeleteStudent } = this.props;
    const roleId = this.getRoleId(bandMember);
    
    return (
      <div
        key={index}
        className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4 rounded-[20px] border border-white/10 bg-inner-bg px-4 py-3"
      >
        <div className="flex justify-center">
          <Avatar style={{ width: "36px", height: "36px" }} />
        </div>

        <div className="min-w-0">
          <Link
            to={`/student/${bandMember.studentId}`}
            className="block truncate text-[16px] font-semibold text-text-main no-underline transition hover:text-white"
          >
            {bandMember.firstName} {bandMember.lastName}
          </Link>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-text-muted">
            <span>{age} лет</span>
            <span className="opacity-40">•</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[13px] text-text-muted transition hover:border-white/20 hover:text-text-main"
              onClick={() => this.handleShowRoleModal(index)}
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
        >
          X
        </Button>
      </div>
    );
  };

  render() {
    const { bandMembers, onAddStudent, showLabel = false } = this.props;
    const { showRoleModal, selectedStudentIndex } = this.state;
    const selectedBandMember = selectedStudentIndex !== null ? bandMembers[selectedStudentIndex] : null;

    return (
      <>
        <div className="flex flex-col gap-4">
          {showLabel && (
            <FormLabel as="div">Участники</FormLabel>
          )}

          {bandMembers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {bandMembers.map((bandMember, index) => this.renderStudent(bandMember, index))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-white/10 bg-inner-bg px-4 py-6 text-center text-[14px] text-text-muted">
              Участники не добавлены
            </div>
          )}

          <div className="text-center">
            <Button variant="primary" size="sm" onClick={onAddStudent}>
              + Добавить
            </Button>
          </div>
        </div>

        {showRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
            <div className="w-full max-w-4xl rounded-[28px] border border-white/10 bg-card-bg p-6 shadow-2xl sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[24px] font-semibold text-text-main">Выберите роль ученика</div>
                  {selectedBandMember ? (
                    <div className="mt-2 text-[14px] text-text-muted">
                      {selectedBandMember.firstName} {selectedBandMember.lastName}
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={this.handleCloseRoleModal}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[14px] text-text-muted transition hover:border-white/20 hover:text-text-main"
                >
                  Закрыть
                </button>
              </div>

              <DisciplineGridSelector
                selectedDisciplineId={selectedBandMember ? this.getRoleId(selectedBandMember) : null}
                onDisciplineChange={this.handleRoleSelect}
                multiSelect={false}
              />
            </div>
          </div>
        )}
      </>
    );
  }
}